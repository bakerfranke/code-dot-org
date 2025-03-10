// Globals:
//   Blockly

var parseXmlElement = require('./xml').parseElement;
var utils = require('./utils');
var dropletUtils = require('./dropletUtils');
var _ = utils.getLodash();
var dom = require('./dom');
var constants = require('./constants.js');
var msg = require('../locale/current/common');
var blockUtils = require('./block_utils');
var url = require('url');
var FeedbackUtils = require('./feedback');

/**
* The minimum width of a playable whole blockly game.
*/
var MIN_WIDTH = 900;
var MOBILE_SHARE_WIDTH_PADDING = 50;
var DEFAULT_MOBILE_NO_PADDING_SHARE_WIDTH = 400;
var WORKSPACE_PLAYSPACE_GAP = 15;
var BLOCK_X_COORDINATE = 70;
var BLOCK_Y_COORDINATE = 30;

/**
 * Treat mobile devices with screen.width less than the value below as phones.
 */
var MAX_PHONE_WIDTH = 500;


var StudioApp = function () {
  this.feedback_ = new FeedbackUtils(this);

  /**
  * The parent directory of the apps. Contains common.js.
  */
  this.BASE_URL = undefined;

  /**
  * If truthy, a version number to be appended to asset urls.
  */
  this.CACHE_BUST = undefined;

  /**
  * The current locale code.
  */
  this.LOCALE = 'en_us';

  this.enableShowCode = true;
  this.editCode = false;
  this.usingBlockly_ = true;

  /**
   * @type {AudioPlayer}
   */
  this.cdoSounds = null;
  this.Dialog = null;
  this.editor = null;

  this.blockYCoordinateInterval = 200;

  // @type {string} for all of these
  this.icon = undefined;
  this.smallIcon = undefined;
  this.winIcon = undefined;
  this.failureIcon = undefined;

  // The following properties get their non-default values set by the application.

  /**
   * Whether to alert user to empty blocks, short-circuiting all other tests.
   * @member {boolean}
   */
  this.checkForEmptyBlocks_ = false;

  /**
  * The ideal number of blocks to solve this level.  Users only get 2
  * stars if they use more than this number.
  * @type {!number=}
  */
  this.IDEAL_BLOCK_NUM = undefined;

  /**
  * An array of dictionaries representing required blocks.  Keys are:
  * - test (required): A test whether the block is present, either:
  *   - A string, in which case the string is searched for in the generated code.
  *   - A single-argument function is called on each user-added block
  *     individually.  If any call returns true, the block is deemed present.
  *     "User-added" blocks are ones that are neither disabled or undeletable.
  * - type (required): The type of block to be produced for display to the user
  *   if the test failed.
  * - titles (optional): A dictionary, where, for each KEY-VALUE pair, this is
  *   added to the block definition: <title name="KEY">VALUE</title>.
  * - value (optional): A dictionary, where, for each KEY-VALUE pair, this is
  *   added to the block definition: <value name="KEY">VALUE</value>
  * - extra (optional): A string that should be blacked between the "block"
  *   start and end tags.
  * @type {!Array=}
  */
  this.requiredBlocks_ = [];

  /**
  * The number of required blocks to give hints about at any one time.
  * Set this to Infinity to show all.
  * @type {!number=}
  */
  this.maxRequiredBlocksToFlag_ = 1;

  /**
  * The number of attempts (how many times the run button has been pressed)
  * @type {?number}
  */
  this.attempts = 0;

  /**
  * Stores the time at init. The delta to current time is used for logging
  * and reporting to capture how long it took to arrive at an attempt.
  * @type {?number}
  */
  this.initTime = undefined;

  /**
  * Enumeration of user program execution outcomes.
  */
  this.ResultType = constants.ResultType;

  /**
  * Enumeration of test results.
  */
  this.TestResults = constants.TestResults;

  /**
   * If true, we don't show blockspace. Used when viewing shared levels
   */
  this.hideSource = false;

  /**
   * If true, we're viewing a shared level.
   */
  this.share = false;

  this.onAttempt = undefined;
  this.onContinue = undefined;
  this.onResetPressed = undefined;
  this.backToPreviousLevel = undefined;
  this.sendToPhone = undefined;
  this.enableShowBlockCount = true;

  this.disableSocialShare = false;
  this.noPadding = false;

  this.MIN_WORKSPACE_HEIGHT = undefined;
};
module.exports = StudioApp;
StudioApp.singleton = new StudioApp();

/**
 * Configure StudioApp options
 */
StudioApp.prototype.configure = function (options) {
  this.BASE_URL = options.baseUrl;
  this.CACHE_BUST = options.cacheBust;
  this.LOCALE = options.locale || this.LOCALE;
  // NOTE: editCode (which currently implies droplet) and usingBlockly_ are
  // currently mutually exclusive.
  this.editCode = options.level && options.level.editCode;
  this.usingBlockly_ = !this.editCode;

  // TODO (bbuchanan) : Replace this editorless-hack with setting an editor enum
  // or (even better) inject an appropriate editor-adaptor.
  if (options.isEditorless) {
    this.editCode = false;
    this.usingBlockly_ = false;
  }

  this.cdoSounds = options.cdoSounds;
  this.Dialog = options.Dialog;

  // Bind assetUrl to the instance so that we don't need to depend on callers
  // binding correctly as they pass this function around.
  this.assetUrl = _.bind(this.assetUrl_, this);
};

/**
 * Common startup tasks for all apps. Happens after configure.
 */
StudioApp.prototype.init = function(config) {
  if (!config) {
    config = {};
  }

  this.setConfigValues_(config);

  this.configureDom(config);

  if (config.hideSource) {
    this.handleHideSource_({
      containerId: config.containerId,
      embed: config.embed,
      level: config.level,
      level_source_id: config.level_source_id,
      phone_share_url: config.send_to_phone_url,
      sendToPhone: config.sendToPhone,
      twitter: config.twitter
    });
  }

  if (config.share) {
    this.handleSharing_({
      noButtonsBelowOnMobileShare: config.noButtonsBelowOnMobileShare,
      makeUrl: config.makeUrl,
      makeString: config.makeString,
      makeImage: config.makeImage,
      makeYourOwn: config.makeYourOwn
    });
  }

  // Record time at initialization.
  this.initTime = new Date().getTime();

  // Fixes viewport for small screens.
  var viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    this.fixViewportForSmallScreens_(viewport, config);
  }

  var showCode = document.getElementById('show-code-header');
  if (showCode && this.enableShowCode) {
    dom.addClickTouchEvent(showCode, _.bind(function() {
      if (this.editCode) {
        var result = this.editor.toggleBlocks();
        if (result.error) {
          // TODO (cpirich) We could extract error.loc to determine where the
          // error occurred and highlight that error
          this.feedback_.showToggleBlocksError(this.Dialog);
        }
        this.updateHeadersAfterDropletToggle_(this.editor.currentlyUsingBlocks);
        if (!this.editor.currentlyUsingBlocks) {
          this.editor.aceEditor.focus();
        }
      } else {
        this.feedback_.showGeneratedCode(this.Dialog);
      }
    }, this));
  }

  var blockCount = document.getElementById('blockCounter');
  if (blockCount && !this.enableShowBlockCount) {
    blockCount.style.display = 'none';
  }

  this.icon = config.skin.staticAvatar;
  this.smallIcon = config.skin.smallStaticAvatar;
  this.winIcon = config.skin.winAvatar;
  this.failureIcon = config.skin.failureAvatar;

  if (config.level.instructionsIcon) {
    this.icon = config.skin[config.level.instructionsIcon];
    this.winIcon = config.skin[config.level.instructionsIcon];
  }

  if (config.showInstructionsWrapper) {
    config.showInstructionsWrapper(_.bind(function () {
      var shouldAutoClose = !!config.level.aniGifURL;
      this.showInstructions_(config.level, shouldAutoClose);
    }, this));
  }

  // The share and embed pages do not show the rotateContainer.
  if (this.share || config.embed) {
    var rotateContainer = document.getElementById('rotateContainer');
    if (rotateContainer) {
      rotateContainer.style.display = 'none';
    }
  }

  // In embed mode, the display scales down when the width of the visualizationColumn goes below the min width
  if(config.embed) {
    var resized = false;
    var resize = function() {
      var vizCol = document.getElementById('visualizationColumn');
      var width = vizCol.offsetWidth;
      var height = vizCol.offsetHeight;
      var displayWidth = DEFAULT_MOBILE_NO_PADDING_SHARE_WIDTH;
      var scale = Math.min(width / displayWidth, height / displayWidth);
      var viz = document.getElementById('visualization');
      viz.style['transform-origin'] = 'left top';
      viz.style['-webkit-transform'] = 'scale(' + scale + ')';
      viz.style['max-height'] = (displayWidth * scale) + 'px';
      viz.style.display = 'block';
      vizCol.style.width = '';
      document.getElementById('visualizationColumn').style['max-width'] = displayWidth + 'px';
      // Needs to run twice on initialization
      if(!resized) {
        resized = true;
        resize();
      }
    };
    // Depends on ResizeSensor.js
    var ResizeSensor = require('./ResizeSensor');
    new ResizeSensor(document.getElementById('visualizationColumn'), resize);
  }

  var orientationHandler = function() {
    window.scrollTo(0, 0);  // Browsers like to mess with scroll on rotate.
    var rotateContainer = document.getElementById('rotateContainer');
    rotateContainer.style.width = window.innerWidth + 'px';
    rotateContainer.style.height = window.innerHeight + 'px';
  };
  window.addEventListener('orientationchange', orientationHandler);
  orientationHandler();

  if (config.loadAudio) {
    config.loadAudio();
  }

  var promptDiv = document.getElementById('prompt');
  if (config.level.instructions) {
    dom.setText(promptDiv, config.level.instructions);
  }

  if (config.level.instructions || config.level.aniGifURL) {
    var promptIcon = document.getElementById('prompt-icon');
    promptIcon.src = this.smallIcon;
  }

  var aniGifPreview = document.getElementById('ani-gif-preview');
  if (config.level.aniGifURL) {
    aniGifPreview.style.backgroundImage = "url('" + config.level.aniGifURL + "')";
    aniGifPreview.onclick = _.bind(function() {
      this.showInstructions_(config.level, false);
    }, this);
    var promptTable = document.getElementById('prompt-table');
    promptTable.className += " with-ani-gif";
  } else {
    var wrapper = document.getElementById('ani-gif-preview-wrapper');
    wrapper.style.display = 'none';
  }

  if (this.editCode) {
    this.handleEditCode_({
      codeFunctions: config.level.codeFunctions,
      dropletConfig: config.dropletConfig,
      categoryInfo: config.level.categoryInfo,
      startBlocks: config.level.startBlocks,
      afterEditorReady: config.afterEditorReady,
      afterInject: config.afterInject
    });
  }

  if (this.isUsingBlockly()) {
    this.handleUsingBlockly_(config);
  }

  // listen for scroll and resize to ensure onResize() is called
  window.addEventListener('scroll', _.bind(function() {
    this.onResize();
    var event = document.createEvent('UIEvents');
    event.initEvent('resize', true, true);  // event type, bubbling, cancelable
    window.dispatchEvent(event);
  }, this));
  window.addEventListener('resize', _.bind(this.onResize, this));

  // Call initial onResize() asynchronously - need 10ms delay to work around
  // relayout which changes height on the left side to the proper value
  window.setTimeout(_.bind(function() {
    this.onResize();
    var event = document.createEvent('UIEvents');
    event.initEvent('resize', true, true);  // event type, bubbling, cancelable
    window.dispatchEvent(event);
    if (this.isUsingBlockly()) {
      Blockly.mainBlockSpace.fireChangeEvent();
    }
  }, this), 10);

  this.reset(true);

  // Add display of blocks used.
  this.setIdealBlockNumber_();

  // TODO (cpirich): implement block count for droplet (for now, blockly only)
  if (this.isUsingBlockly()) {
    Blockly.mainBlockSpaceEditor.addChangeListener(_.bind(function() {
      this.updateBlockCount();
    }, this));

    if (config.level.openFunctionDefinition) {
      Blockly.functionEditor.openWithLevelConfiguration(config.level);
    }
  }

  // Bind listener to 'Clear Puzzle' button
  var clearPuzzleHeader = document.getElementById('clear-puzzle-header');
  if (clearPuzzleHeader) {
    dom.addClickTouchEvent(clearPuzzleHeader, (function() {
      this.feedback_.showClearPuzzleConfirmation(this.Dialog, (function() {
        if (Blockly.functionEditor) {
          Blockly.functionEditor.hideIfOpen();
        }
        Blockly.mainBlockSpace.clear();
        this.setStartBlocks_(config, false);
      }).bind(this));
    }).bind(this));
  }
};

/**
 * TRUE if the current app uses blockly (as opposed to editCode or another
 * editor)
 * @return {boolean}
 */
StudioApp.prototype.isUsingBlockly = function () {
  return this.usingBlockly_;
};

/**
 *
 */
StudioApp.prototype.handleSharing_ = function (options) {
  // 1. Move the buttons, 2. Hide the slider in the share page for mobile.
  var belowVisualization = document.getElementById('belowVisualization');
  if (dom.isMobile()) {
    var sliderCell = document.getElementById('slider-cell');
    if (sliderCell) {
      sliderCell.style.display = 'none';
    }
    if (belowVisualization) {
      if (options.noButtonsBelowOnMobileShare) {
        belowVisualization.style.display = 'none';
        visualization.style.marginBottom = '0px';
      } else {
        belowVisualization.style.display = 'block';
        belowVisualization.style.marginLeft = '0px';
        if (this.noPadding) {
          // Shift run and reset buttons off the left edge if we have no padding
          if (runButton) {
            runButton.style.marginLeft = '10px';
          }
          if (resetButton) {
            resetButton.style.marginLeft = '10px';
          }
          var shareCell = document.getElementById('share-cell') ||
          document.getElementById('right-button-cell');
          if (shareCell) {
            shareCell.style.marginLeft = '10px';
            shareCell.style.marginRight = '10px';
          }
          var softButtons = document.getElementById('soft-buttons');
          if (softButtons) {
            softButtons.style.marginLeft = '10px';
            softButtons.style.marginRight = '10px';
          }
        }
      }
    }
  }

  // Show flappy upsale on desktop and mobile.  Show learn upsale only on desktop
  var upSale = document.createElement('div');
  if (options.makeYourOwn) {
    upSale.innerHTML = require('./templates/makeYourOwn.html')({
      data: {
        makeUrl: options.makeUrl,
        makeString: options.makeString,
        makeImage: options.makeImage
      }
    });
    if (this.noPadding) {
      upSale.style.marginLeft = '10px';
    }
    belowVisualization.appendChild(upSale);
  } else if (typeof options.makeYourOwn === 'undefined') {
    upSale.innerHTML = require('./templates/learn.html')({
      assetUrl: this.assetUrl
    });
    belowVisualization.appendChild(upSale);
  }
};

/**
 * Get the url of path appended to BASE_URL
 */
StudioApp.prototype.assetUrl_ = function (path) {
  if (this.BASE_URL === undefined) {
    throw new Error('StudioApp BASE_URL has not been set. ' +
      'Call configure() first');
  }
  return this.BASE_URL + path;
};

/**
 * Reset the playing field to the start position and kill any pending
 * animation tasks.  This will typically be replaced by an application.
 * @param {boolean} shouldPlayOpeningAnimation True if an opening animation is
 *   to be played.
 */
StudioApp.prototype.reset = function (shouldPlayOpeningAnimation) {
  // TODO (bbuchanan): Look for comon reset logic we can pull here
  // Override in app subclass
};


/**
 * Override to change run behavior.
 */
StudioApp.prototype.runButtonClick = function() {};

/**
 * Toggle whether run button or reset button is shown
 * @param {string} button Button to show, either "run" or "reset"
 */
StudioApp.prototype.toggleRunReset = function(button) {
  var showRun = (button === 'run');
  if (button !== 'run' && button !== 'reset') {
    throw "Unexpected input";
  }

  var run = document.getElementById('runButton');
  var reset = document.getElementById('resetButton');
  run.style.display = showRun ? 'inline-block' : 'none';
  run.disabled = !showRun;
  reset.style.display = !showRun ? 'inline-block' : 'none';
  reset.disabled = showRun;
};

/**
 * Attempts to associate a set of audio files to a given name
 * Handles the case where cdoSounds does not exist, e.g. in tests
 * and grunt dev preview mode
 * @param {Array.<string>} filenames file paths for sounds
 * @param {string} name ID to associate sound effect with
 */
StudioApp.prototype.loadAudio = function(filenames, name) {
  if (!this.cdoSounds) {
    return;
  }

  this.cdoSounds.registerByFilenamesAndID(filenames, name);
};

/**
 * Attempts to play a sound effect
 * @param {string} name sound ID
 * @param {Object} options for sound playback
 * @param {number} options.volume value between 0.0 and 1.0 specifying volume
 */
StudioApp.prototype.playAudio = function(name, options) {
  if (!this.cdoSounds) {
    return;
  }

  options = options || {};
  var defaultOptions = {volume: 0.5};
  var newOptions = utils.extend(defaultOptions, options);
  this.cdoSounds.play(name, newOptions);
};

/**
 * Stops looping a given sound
 * @param {string} name ID of sound
 */
StudioApp.prototype.stopLoopingAudio = function(name) {
  if (!this.cdoSounds) {
    return;
  }

  this.cdoSounds.stopLoopingAudio(name);
};

/**
* @param {Object} options Configuration parameters for Blockly. Parameters are
* optional and include:
*  - {string} path The root path to the /apps directory, defaults to the
*    the directory in which this script is located.
*  - {boolean} rtl True if the current language right to left.
*  - {DomElement} toolbox The element in which to insert the toolbox,
*    defaults to the element with 'toolbox'.
*  - {boolean} trashcan True if the trashcan should be displayed, defaults to
*    true.
* @param {DomElement} div The parent div in which to insert Blockly.
*/
StudioApp.prototype.inject = function(div, options) {
  var defaults = {
    assetUrl: this.assetUrl,
    rtl: this.isRtl(),
    toolbox: document.getElementById('toolbox'),
    trashcan: true
  };
  Blockly.inject(div, utils.extend(defaults, options), this.cdoSounds);
};

/**
 * Returns true if the current HTML page is in right-to-left language mode.
 */
StudioApp.prototype.isRtl = function() {
  var head = document.getElementsByTagName('head')[0];
  if (head && head.parentElement) {
    var dir = head.parentElement.getAttribute('dir');
    return (dir && dir.toLowerCase() === 'rtl');
  } else {
    return false;
  }
};

/**
 * @return {string} Locale direction string based on app direction.
 */
StudioApp.prototype.localeDirection = function() {
  return (this.isRtl() ? 'rtl' : 'ltr');
};

/**
* Initialize Blockly for a readonly iframe.  Called on page load. No sounds.
* XML argument may be generated from the console with:
* Blockly.Xml.domToText(Blockly.Xml.blockSpaceToDom(Blockly.mainBlockSpace)).slice(5, -6)
*/
StudioApp.prototype.initReadonly = function(options) {
  Blockly.inject(document.getElementById('blockly'), {
    assetUrl: this.assetUrl,
    readOnly: true,
    rtl: this.isRtl(),
    scrollbars: false
  });
  this.loadBlocks(options.blocks);
};

/**
* Load the editor with blocks.
* @param {string} blocksXml Text representation of blocks.
*/
StudioApp.prototype.loadBlocks = function(blocksXml) {
  var xml = parseXmlElement(blocksXml);
  Blockly.Xml.domToBlockSpace(Blockly.mainBlockSpace, xml);
};

/**
* Spreading out the top blocks in workspace if it is not already set.
* @param {string} startBlocks String representation of start blocks xml.
* @param {Object.<Object>} arrangement A map from block type to position.
* @return {string} String representation of start blocks xml, including
*    block position.
*/
StudioApp.prototype.arrangeBlockPosition = function(startBlocks, arrangement) {
  var type, arrangeX, arrangeY;
  var xml = parseXmlElement(startBlocks);
  var xmlChildNodes = this.sortBlocksByVisibility(xml.childNodes);
  var numberOfPlacedBlocks = 0;
  for (var x = 0, xmlChild; xmlChildNodes && x < xmlChildNodes.length; x++) {
    xmlChild = xmlChildNodes[x];

    // Only look at element nodes
    if (xmlChild.nodeType === 1) {
      // look to see if we have a predefined arrangement for this type
      type = xmlChild.getAttribute('type');
      arrangeX = arrangement && arrangement[type] ? arrangement[type].x : null;
      arrangeY = arrangement && arrangement[type] ? arrangement[type].y : null;

      xmlChild.setAttribute('x', xmlChild.getAttribute('x') || arrangeX ||
        BLOCK_X_COORDINATE);
      xmlChild.setAttribute('y', xmlChild.getAttribute('y') || arrangeY ||
        BLOCK_Y_COORDINATE +
      this.blockYCoordinateInterval * numberOfPlacedBlocks);
      numberOfPlacedBlocks += 1;
    }
  }
  return Blockly.Xml.domToText(xml);
};

/**
* Sorts the array of xml blocks, moving visible blocks to the front.
* @param {Array.<Element>} xmlBlocks An array of xml blocks.
* @return {Array.<Element>} A sorted array of xml blocks, with all
*     visible blocks preceding all hidden blocks.
*/
StudioApp.prototype.sortBlocksByVisibility = function(xmlBlocks) {
  var userVisible;
  var currentlyHidden = false;
  var visibleXmlBlocks = [];
  var hiddenXmlBlocks = [];
  for (var x = 0, xmlBlock; xmlBlocks && x < xmlBlocks.length; x++) {
    xmlBlock = xmlBlocks[x];
    if (xmlBlock.getAttribute) {
      userVisible = xmlBlock.getAttribute('uservisible');
      var type = xmlBlock.getAttribute('type');
      currentlyHidden = type && Blockly.Blocks[type].hideInMainBlockSpace;
    }

    if (currentlyHidden || userVisible === 'false') {
      hiddenXmlBlocks.push(xmlBlock);
    } else {
      visibleXmlBlocks.push(xmlBlock);
    }
  }
  return visibleXmlBlocks.concat(hiddenXmlBlocks);
};

StudioApp.prototype.createModalDialogWithIcon = function(options) {
  return this.feedback_.createModalDialogWithIcon(options);
};

StudioApp.prototype.showInstructions_ = function(level, autoClose) {
  var instructionsDiv = document.createElement('div');
  instructionsDiv.innerHTML = require('./templates/instructions.html')(level);

  var buttons = document.createElement('div');
  buttons.innerHTML = require('./templates/buttons.html')({
    data: {
      ok: true
    }
  });

  instructionsDiv.appendChild(buttons);

  var dialog = this.createModalDialogWithIcon({
    Dialog: this.Dialog,
    contentDiv: instructionsDiv,
    icon: this.icon,
    defaultBtnSelector: '#ok-button'
  });

  if (autoClose) {
    setTimeout(function() {
      dialog.hide();
    }, 32000);
  }

  var okayButton = buttons.querySelector('#ok-button');
  if (okayButton) {
    dom.addClickTouchEvent(okayButton, function() {
      if (dialog) {
        dialog.hide();
      }
    });
  }

  dialog.show();
};

/**
*  Resizes the blockly workspace.
*/
StudioApp.prototype.onResize = function() {

  // First, grab the main app container
  // This is inconsistently named across apps right now
  // TODO (bbuchanan) : Unify parent app container names
  var div;
  if (this.editCode) {
    div = document.getElementById('codeWorkspace');
  } else if (this.isUsingBlockly()) {
    div = document.getElementById('blockly');
  }

  var divParent = div.parentNode;
  var parentStyle = window.getComputedStyle(divParent);

  var parentWidth = parseInt(parentStyle.width, 10);
  var parentHeight = parseInt(parentStyle.height, 10);

  var headers = document.getElementById('headers');
  var headersHeight = parseInt(window.getComputedStyle(headers).height, 10);

  div.style.top = divParent.offsetTop + 'px';

  var visualizationColumn = document.getElementById('visualizationColumn');
  var gameWidth = visualizationColumn.getBoundingClientRect().width;
  var fullWorkspaceWidth = parentWidth - (gameWidth + WORKSPACE_PLAYSPACE_GAP);

  // Keep blocks static relative to the right edge in RTL mode
  var oldWidth = parseInt(div.style.width, 10) || div.getBoundingClientRect().width;
  if (this.isUsingBlockly() && Blockly.RTL && (fullWorkspaceWidth - oldWidth !== 0)) {
    Blockly.mainBlockSpace.getTopBlocks().forEach(function (topBlock) {
      topBlock.moveBy(fullWorkspaceWidth - oldWidth, 0);
    });
  }

  if (this.isRtl()) {
    div.style.marginRight = (gameWidth + WORKSPACE_PLAYSPACE_GAP) + 'px';
  }
  else {
    div.style.marginLeft = (gameWidth + WORKSPACE_PLAYSPACE_GAP) + 'px';
  }
  if (this.editCode) {
    // Position the inner codeTextbox element below the headers
    var codeTextbox = document.getElementById('codeTextbox');
    codeTextbox.style.height = (parentHeight - headersHeight) + 'px';
    codeTextbox.style.width = fullWorkspaceWidth + 'px';
    codeTextbox.style.top = headersHeight + 'px';

    // The outer codeWorkspace element height should match its parent:
    div.style.height = parentHeight + 'px';
  } else {
    // reduce height by headers height because blockly isn't aware of headers
    // and will size its svg element to be too tall
    div.style.height = (parentHeight - headersHeight) + 'px';
  }

  div.style.width = fullWorkspaceWidth + 'px';
  this.resizeHeaders(fullWorkspaceWidth);
};

// |          toolbox-header          | workspace-header  | show-code-header |
// |
// |           toolboxWidth           |
// |                 |         <--------- workspaceWidth ---------->         |
// |         <---------------- fullWorkspaceWidth ----------------->         |
StudioApp.prototype.resizeHeaders = function (fullWorkspaceWidth) {
  var toolboxWidth = 0;
  var showCodeWidth = 0;

  var clearPuzzleHeader = document.getElementById('clear-puzzle-header');
  var clearPuzzleWidth = clearPuzzleHeader ?
      clearPuzzleHeader.getBoundingClientRect().width : 0;

  var headersDiv = document.getElementById('headers');
  if (headersDiv) {
    headersDiv.style.width = fullWorkspaceWidth + 'px';
  }

  var toolboxHeader = document.getElementById('toolbox-header');
  if (toolboxHeader) {
    if (this.editCode) {
      // If in the droplet editor, but not using blocks, keep categoryWidth at 0
      if (this.editor && this.editor.currentlyUsingBlocks) {
        // Set toolboxWidth based on the block palette width:
        var categories = document.querySelector('.droplet-palette-wrapper');
        toolboxWidth = categories.getBoundingClientRect().width;
      }
    } else if (this.isUsingBlockly()) {
      toolboxWidth = Blockly.mainBlockSpaceEditor.getToolboxWidth();
    }
    toolboxHeader.style.width = toolboxWidth + 'px';
  }

  var showCodeHeader = document.getElementById('show-code-header');
  if (showCodeHeader) {
    var minWorkspaceWidthForShowCode = this.editCode ? 250 : 450;
    if (this.enableShowCode &&
        (fullWorkspaceWidth - toolboxWidth > minWorkspaceWidthForShowCode)) {
      showCodeWidth = showCodeHeader.getBoundingClientRect().width;
      showCodeHeader.style.display = "";
    } else {
      showCodeHeader.style.display = "none";
    }
  }

  var workspaceHeader = document.getElementById('workspace-header');
  if (workspaceHeader) {
    workspaceHeader.style.width =
        (fullWorkspaceWidth - toolboxWidth - clearPuzzleWidth - showCodeWidth) + 'px';
  }
};

/**
* Highlight the block (or clear highlighting).
* @param {?string} id ID of block that triggered this action.
* @param {boolean} spotlight Optional.  Highlight entire block if true
*/
StudioApp.prototype.highlight = function(id, spotlight) {
  if (this.isUsingBlockly()) {
    if (id) {
      var m = id.match(/^block_id_(\d+)$/);
      if (m) {
        id = m[1];
      }
    }

    Blockly.mainBlockSpace.highlightBlock(id, spotlight);
  }
};

/**
* Remove highlighting from all blocks
*/
StudioApp.prototype.clearHighlighting = function () {
  this.highlight(null);
};

/**
* Display feedback based on test results.  The test results must be
* explicitly provided.
* @param {{feedbackType: number}} Test results (a constant property of
*     this.TestResults).
*/
StudioApp.prototype.displayFeedback = function(options) {
  options.Dialog = this.Dialog;
  options.onContinue = this.onContinue;
  options.backToPreviousLevel = this.backToPreviousLevel;
  options.sendToPhone = this.sendToPhone;

  // Special test code for edit blocks.
  if (options.level.edit_blocks) {
    options.feedbackType = this.TestResults.EDIT_BLOCKS;
  }

  this.feedback_.displayFeedback(options, this.requiredBlocks_,
      this.maxRequiredBlocksToFlag_);
};

/**
 * Runs the tests and returns results.
 * @param {boolean} levelComplete Was the level completed successfully?
 * @param {Object} options
 * @return {number} The appropriate property of TestResults.
 */
StudioApp.prototype.getTestResults = function(levelComplete, options) {
  return this.feedback_.getTestResults(levelComplete,
      this.requiredBlocks_, this.checkForEmptyBlocks_, options);
};

// Builds the dom to get more info from the user. After user enters info
// and click "create level" onAttemptCallback is called to deliver the info
// to the server.
StudioApp.prototype.builderForm_ = function(onAttemptCallback) {
  var builderDetails = document.createElement('div');
  builderDetails.innerHTML = require('./templates/builder.html')();
  var dialog = this.createModalDialogWithIcon({
    Dialog: this.Dialog,
    contentDiv: builderDetails,
    icon: this.icon
  });
  var createLevelButton = document.getElementById('create-level-button');
  dom.addClickTouchEvent(createLevelButton, function() {
    var instructions = builderDetails.querySelector('[name="instructions"]').value;
    var name = builderDetails.querySelector('[name="level_name"]').value;
    var query = url.parse(window.location.href, true).query;
    onAttemptCallback(utils.extend({
      "instructions": instructions,
      "name": name
    }, query));
  });

  dialog.show({ backdrop: 'static' });
};

/**
* Report back to the server, if available.
* @param {object} options - parameter block which includes:
* {string} app The name of the application.
* {number} id A unique identifier generated when the page was loaded.
* {string} level The ID of the current level.
* {number} result An indicator of the success of the code.
* {number} testResult More specific data on success or failure of code.
* {string} program The user program, which will get URL-encoded.
* {function} onComplete Function to be called upon completion.
*/
StudioApp.prototype.report = function(options) {
  // copy from options: app, level, result, testResult, program, onComplete
  var report = options;
  report.pass = this.feedback_.canContinueToNextLevel(options.testResult);
  report.time = ((new Date().getTime()) - this.initTime);
  report.attempt = this.attempts;
  report.lines = this.feedback_.getNumBlocksUsed();

  // If hideSource is enabled, the user is looking at a shared level that
  // they cannot have modified. In that case, don't report it to the service
  // or call the onComplete() callback expected. The app will just sit
  // there with the Reset button as the only option.
  var self = this;
  if (!(this.hideSource && this.share)) {
    var onAttemptCallback = (function() {
      return function(builderDetails) {
        for (var option in builderDetails) {
          report[option] = builderDetails[option];
        }
        self.onAttempt(report);
      };
    })();

    // If this is the level builder, go to builderForm to get more info from
    // the level builder.
    if (options.builder) {
      this.builderForm_(onAttemptCallback);
    } else {
      onAttemptCallback();
    }
  }
};

/**
* Click the reset button.  Reset the application.
*/
StudioApp.prototype.resetButtonClick = function() {
  this.onResetPressed();
  this.toggleRunReset('run');
  this.clearHighlighting();
  if (this.isUsingBlockly()) {
    Blockly.mainBlockSpaceEditor.setEnableToolbox(true);
    Blockly.mainBlockSpace.traceOn(false);
  }
  this.reset(false);
};

/**
* Add count of blocks used.
*/
StudioApp.prototype.updateBlockCount = function() {
  // If the number of block used is bigger than the ideal number of blocks,
  // set it to be yellow, otherwise, keep it as black.
  var element = document.getElementById('blockUsed');
  if (this.IDEAL_BLOCK_NUM < this.feedback_.getNumCountableBlocks()) {
    element.className = "block-counter-overflow";
  } else {
    element.className = "block-counter-default";
  }

  // Update number of blocks used.
  if (element) {
    element.innerHTML = '';  // Remove existing children or text.
    element.appendChild(document.createTextNode(
      this.feedback_.getNumCountableBlocks()));
  }
};

/**
 * Set the ideal Number of blocks.
 */
StudioApp.prototype.setIdealBlockNumber_ = function() {
  var element = document.getElementById('idealBlockNumber');
  if (!element) {
    return;
  }

  var idealBlockNumberMsg = this.IDEAL_BLOCK_NUM === Infinity ?
    msg.infinity() : this.IDEAL_BLOCK_NUM;
  element.innerHTML = '';  // Remove existing children or text.
  element.appendChild(document.createTextNode(
    idealBlockNumberMsg));
};


/**
 *
 */
StudioApp.prototype.fixViewportForSmallScreens_ = function (viewport, config) {
  var deviceWidth;
  var desiredWidth;
  var minWidth;
  if (this.share && dom.isMobile()) {
    var mobileNoPaddingShareWidth =
      config.mobileNoPaddingShareWidth || DEFAULT_MOBILE_NO_PADDING_SHARE_WIDTH;
    // for mobile sharing, don't assume landscape mode, use screen.width
    deviceWidth = desiredWidth = screen.width;
    if (this.noPadding && screen.width < MAX_PHONE_WIDTH) {
      desiredWidth = Math.min(desiredWidth, mobileNoPaddingShareWidth);
    }
    minWidth = mobileNoPaddingShareWidth +
      (this.noPadding ? 0 : MOBILE_SHARE_WIDTH_PADDING);
  }
  else {
    // assume we are in landscape mode, so width is the longer of the two
    deviceWidth = desiredWidth = Math.max(screen.width, screen.height);
    minWidth = MIN_WIDTH;
  }
  var width = Math.max(minWidth, desiredWidth);
  var scale = deviceWidth / width;
  var content = ['width=' + width,
    'minimal-ui',
    'initial-scale=' + scale,
    'maximum-scale=' + scale,
    'minimum-scale=' + scale,
    'target-densityDpi=device-dpi',
    'user-scalable=no'];
  viewport.setAttribute('content', content.join(', '));
};

/**
 *
 */
StudioApp.prototype.setConfigValues_ = function (config) {
  this.share = config.share;

  // if true, dont provide links to share on fb/twitter
  this.disableSocialShare = config.disableSocialShare;
  this.sendToPhone = config.sendToPhone;
  this.noPadding = config.noPadding;

  // contract editor requires more vertical space. set height to 1250 unless
  // explicitly specified
  if (config.level.useContractEditor) {
    config.level.minWorkspaceHeight = config.level.minWorkspaceHeight || 1250;
  }

  this.IDEAL_BLOCK_NUM = config.level.ideal || Infinity;
  this.MIN_WORKSPACE_HEIGHT = config.level.minWorkspaceHeight || 800;
  this.requiredBlocks_ = config.level.requiredBlocks || [];

  // enableShowCode defaults to true if not defined
  this.enableShowCode = (config.enableShowCode !== false);

  // If the level has no ideal block count, don't show a block count. If it does
  // have an ideal, show block count unless explicitly configured not to.
  if (config.level && (config.level.ideal === undefined || config.level.ideal === Infinity)) {
    this.enableShowBlockCount = false;
  } else {
    this.enableShowBlockCount = config.enableShowBlockCount !== false;
  }

  // Store configuration.
  this.onAttempt = config.onAttempt || function () {};
  this.onContinue = config.onContinue || function () {};
  this.onResetPressed = config.onResetPressed || function () {};
  this.backToPreviousLevel = config.backToPreviousLevel || function () {};
};

/**
 * Begin modifying the DOM based on config.
 * Note: Has side effects on config
 */
StudioApp.prototype.configureDom = function (config) {
  var container = document.getElementById(config.containerId);
  container.innerHTML = config.html;

  var runButton = container.querySelector('#runButton');
  var resetButton = container.querySelector('#resetButton');
  var throttledRunClick = _.debounce(function () {
    if (window.Blockly) {
      // TODO: (Josh L.) use $.trigger once we add jQuery
      Blockly.fireUiEvent(window, 'run_button_pressed');
    }
    this.runButtonClick();
  }, 250, true);
  dom.addClickTouchEvent(runButton, _.bind(throttledRunClick, this));
  dom.addClickTouchEvent(resetButton, _.bind(this.resetButtonClick, this));

  var belowViz = document.getElementById('belowVisualization');
  var referenceArea = document.getElementById('reference_area');
  if (referenceArea) {
    belowViz.appendChild(referenceArea);
  }

  var visualizationColumn = document.getElementById('visualizationColumn');
  var visualization = document.getElementById('visualization');

  // center game screen in embed mode
  if(config.embed) {
    visualizationColumn.style.margin = "0 auto";
  }

  if (this.isUsingBlockly() && config.level.edit_blocks) {
    // Set a class on the main blockly div so CSS can style blocks differently
    Blockly.addClass_(container.querySelector('#blockly'), 'edit');
    // If in level builder editing blocks, make workspace extra tall
    visualizationColumn.style.height = "3000px";
    // Modify the arrangement of toolbox blocks so categories align left
    if (config.level.edit_blocks == "toolbox_blocks") {
      this.blockYCoordinateInterval = 80;
      config.blockArrangement = { category : { x: 20 } };
    }
    // Enable param & var editing in levelbuilder, regardless of level setting
    config.level.disableParamEditing = false;
    config.level.disableVariableEditing = false;
  } else if (!config.hideSource) {
    visualizationColumn.style.minHeight = this.MIN_WORKSPACE_HEIGHT + 'px';
  }

  if (!config.embed && !config.hideSource) {
    // Make the visualization responsive to screen size, except on share page.
    visualization.className += " responsive";
    visualizationColumn.className += " responsive";
  }
};

/**
 *
 */
StudioApp.prototype.handleHideSource_ = function (options) {
  var container = document.getElementById(options.containerId);
  this.hideSource = true;
  var workspaceDiv = this.editCode ?
    document.getElementById('codeWorkspace') :
    container.querySelector('#blockly');
  if(!options.embed || options.level.skipInstructionsPopup) {
    container.className = 'hide-source';
  }
  workspaceDiv.style.visibility = 'hidden';
  // For share page on mobile, do not show this part.
  if ((!options.embed) && (!this.share || !dom.isMobile())) {
    var buttonRow = runButton.parentElement;
    var openWorkspace = document.createElement('button');
    openWorkspace.setAttribute('id', 'open-workspace');
    openWorkspace.appendChild(document.createTextNode(msg.openWorkspace()));

    var belowViz = document.getElementById('belowVisualization');
    belowViz.appendChild(this.feedback_.createSharingDiv({
      response: {
        level_source: window.location,
        level_source_id: options.level_source_id,
        phone_share_url: options.phone_share_url
      },
      sendToPhone: options.sendToPhone,
      level: options.level,
      twitter: options.twitter,
      onMainPage: true
    }));

    dom.addClickTouchEvent(openWorkspace, function() {
      workspaceDiv.style.visibility = 'visible';
    });

    buttonRow.appendChild(openWorkspace);
  }
};

StudioApp.prototype.handleEditCode_ = function (options) {
  requirejs(['droplet'], _.bind(function(droplet) {
    var displayMessage, examplePrograms, messageElement, onChange, startingText;

    // Ensure global ace variable is the same as window.ace
    // (important because they can be different in our test environment)
    ace = window.ace;

    this.editor = new droplet.Editor(document.getElementById('codeTextbox'), {
      mode: 'javascript',
      modeOptions: dropletUtils.generateDropletModeOptions(options.dropletConfig),
      palette: dropletUtils.generateDropletPalette(options.codeFunctions,
        options.dropletConfig)
    });

    this.editor.aceEditor.setShowPrintMargin(false);

    // Add an ace completer for the API functions exposed for this level
    if (options.dropletConfig) {
      var langTools = window.ace.require("ace/ext/language_tools");
      langTools.addCompleter(
        dropletUtils.generateAceApiCompleter(options.dropletConfig));
    }

    this.editor.aceEditor.setOptions({
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true
    });

    if (options.startBlocks) {
      this.editor.setValue(options.startBlocks);
    }

    if (options.afterEditorReady) {
      options.afterEditorReady();
    }
  }, this));

  if (options.afterInject) {
    options.afterInject();
  }
};

/**
 * Set whether to alert user to empty blocks, short-circuiting all other tests.
 * @param {boolean} checkBlocks Whether to check for empty blocks.
 */
StudioApp.prototype.setCheckForEmptyBlocks = function (checkBlocks) {
  this.checkForEmptyBlocks_ = checkBlocks;
};

/**
 * Add the starting block(s).
 * @param loadLastAttempt If true, try to load config.lastAttempt.
 */
StudioApp.prototype.setStartBlocks_ = function (config, loadLastAttempt) {
  var startBlocks = config.level.startBlocks || '';
  if (loadLastAttempt) {
    startBlocks = config.level.lastAttempt || startBlocks;
  }
  if (config.forceInsertTopBlock) {
    startBlocks = blockUtils.forceInsertTopBlock(startBlocks,
        config.forceInsertTopBlock);
  }
  startBlocks = this.arrangeBlockPosition(startBlocks, config.blockArrangement);
  this.loadBlocks(startBlocks);
};

/**
 *
 */
StudioApp.prototype.handleUsingBlockly_ = function (config) {
  // Allow empty blocks if editing blocks.
  if (config.level.edit_blocks) {
    this.checkForEmptyBlocks_ = false;
    if (config.level.edit_blocks === 'required_blocks' ||
      config.level.edit_blocks === 'toolbox_blocks') {
      // Don't show when run block for toolbox/required block editing
      config.forceInsertTopBlock = null;
    }
  }

  // If levelbuilder provides an empty toolbox, some apps (like artist)
  // replace it with a full toolbox. I think some levels may depend on this
  // behavior. We want a way to specify no toolbox, which is <xml></xml>
  if (config.level.toolbox) {
    var toolboxWithoutWhitespace = config.level.toolbox.replace(/\s/g, '');
    if (toolboxWithoutWhitespace === '<xml></xml>' ||
        toolboxWithoutWhitespace === '<xml/>') {
      config.level.toolbox = undefined;
    }
  }

  var div = document.getElementById('blockly');
  var options = {
    toolbox: config.level.toolbox,
    disableParamEditing: config.level.disableParamEditing === undefined ?
        true : config.level.disableParamEditing,
    disableVariableEditing: config.level.disableVariableEditing === undefined ?
        false : config.level.disableVariableEditing,
    useModalFunctionEditor: config.level.useModalFunctionEditor === undefined ?
        false : config.level.useModalFunctionEditor,
    useContractEditor: config.level.useContractEditor === undefined ?
        false : config.level.useContractEditor,
    defaultNumExampleBlocks: config.level.defaultNumExampleBlocks === undefined ?
        2 : config.level.defaultNumExampleBlocks,
    scrollbars: config.level.scrollbars,
    editBlocks: config.level.edit_blocks === undefined ?
        false : config.level.edit_blocks
  };
  ['trashcan', 'varsInGlobals', 'grayOutUndeletableBlocks',
    'disableParamEditing', 'generateFunctionPassBlocks'].forEach(
    function (prop) {
      if (config[prop] !== undefined) {
        options[prop] = config[prop];
      }
    });
  this.inject(div, options);

  if (config.afterInject) {
    config.afterInject();
  }
  this.setStartBlocks_(config, true);
};

/**
 * Modify the workspace header after a droplet blocks/code toggle
 */
StudioApp.prototype.updateHeadersAfterDropletToggle_ = function (usingBlocks) {
  // Update header titles:
  var showCodeHeader = document.getElementById('show-code-header');
  var newButtonTitle = usingBlocks ? msg.showCodeHeader() :
    msg.showBlocksHeader();
  showCodeHeader.firstChild.innerText = newButtonTitle;

  var workspaceHeaderSpan = document.getElementById('workspace-header-span');
  newButtonTitle = usingBlocks ? msg.workspaceHeader() :
    msg.workspaceHeaderJavaScript();
  workspaceHeaderSpan.innerText = newButtonTitle;

  var blockCount = document.getElementById('blockCounter');
  if (blockCount) {
    blockCount.style.display =
      (usingBlocks && this.enableShowBlockCount) ? 'inline-block' : 'none';
  }

  // Resize (including headers), so the category header will appear/disappear:
  this.onResize();
};

/**
 * Do we have any floating blocks not attached to an event block or function block?
 */
StudioApp.prototype.hasExtraTopBlocks = function () {
  return this.feedback_.hasExtraTopBlocks();
};

/**
 *
 */
StudioApp.prototype.hasQuestionMarksInNumberField = function () {
  return this.feedback_.hasQuestionMarksInNumberField();
};

/**
 * @param {Blockly.Block} block Block to check
 * @returns true if the block has a connection without a block attached
 */
function isUnfilledBlock(block) {
  return block.inputList.some(function (input) {
    return input.connection && !input.connection.targetBlock();
  });
}

/**
 * @returns true if any block in the workspace has an unfilled input
 */
StudioApp.prototype.hasUnfilledBlock = function () {
  return Blockly.mainBlockSpace.getAllBlocks().some(isUnfilledBlock);
};

StudioApp.prototype.createCoordinateGridBackground = function (options) {
  var svgName = options.svg;
  var origin = options.origin;
  var firstLabel = options.firstLabel;
  var lastLabel = options.lastLabel;
  var increment = options.increment;

  var CANVAS_HEIGHT = 400;
  var CANVAS_WIDTH = 400;

  var svg = document.getElementById(svgName);

  var bbox, text, rect;
  for (var label = firstLabel; label <= lastLabel; label += increment) {
    // create x axis labels
    text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.appendChild(document.createTextNode(label));
    svg.appendChild(text);
    bbox = text.getBBox();
    text.setAttribute('x', label - origin - bbox.width / 2);
    text.setAttribute('y', CANVAS_HEIGHT);
    text.setAttribute('font-weight', 'bold');
    rect = rectFromElementBoundingBox(text);
    rect.setAttribute('fill', 'white');
    svg.insertBefore(rect, text);

    // create y axis labels
    text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.appendChild(document.createTextNode(label));
    svg.appendChild(text);
    bbox = text.getBBox();
    text.setAttribute('x', 0);
    text.setAttribute('y', CANVAS_HEIGHT - (label - origin));
    text.setAttribute('dominant-baseline', 'central');
    text.setAttribute('font-weight', 'bold');
    rect = rectFromElementBoundingBox(text);
    rect.setAttribute('fill', 'white');
    svg.insertBefore(rect, text);
  }
};

function rectFromElementBoundingBox(element) {
  var bbox = element.getBBox();
  var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.setAttribute('x', bbox.x);
  rect.setAttribute('y', bbox.y);
  rect.setAttribute('width', bbox.width);
  rect.setAttribute('height', bbox.height);
  return rect;
}
