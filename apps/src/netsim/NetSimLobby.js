/* jshint
 funcscope: true,
 newcap: true,
 nonew: true,
 shadow: false,
 unused: true,

 maxlen: 90,
 maxparams: 4,
 maxstatements: 200
 */
/* global $ */
'use strict';

var dom = require('../dom');
var utils = require('../utils');
var netsimUtils = require('./netsimUtils');
var NetSimLogger = require('./NetSimLogger');
var NetSimClientNode = require('./NetSimClientNode');
var NetSimRouterNode = require('./NetSimRouterNode');
var markup = require('./NetSimLobby.html');

var logger = new NetSimLogger(console, NetSimLogger.LogLevel.VERBOSE);

/**
 * Value of any option in the shard selector that does not
 * represent an actual shard - e.g. '-- PICK ONE --'
 * @type {string}
 * @const
 */
var SELECTOR_NONE_VALUE = 'none';

/**
 * Generator and controller for shard lobby/connection controls.
 *
 * @param {NetSimConnection} connection - The shard connection that this
 *        lobby control will manipulate.
 * @param {DashboardUser} user - The current user, logged in or not.
 * @param {string} [shardID]
 * @constructor
 */
var NetSimLobby = module.exports = function (connection, user, shardID) {

  /**
   * Shard connection that this lobby control will manipulate.
   * @type {NetSimConnection}
   * @private
   */
  this.connection_ = connection;
  this.connection_.statusChanges.register(this.refresh_.bind(this));
  logger.info("NetSimLobby registered to connection statusChanges");
  this.connection_.shardChange.register(this.onShardChange_.bind(this));
  logger.info("NetSimLobby registered to connection shardChanges");

  /**
   * A reference to the currently connected shard.
   * @type {?NetSimShard}
   * @private
   */
  this.shard_ = null;

  /**
   * Current user, logged in or no.
   * @type {DashboardUser}
   * @private
   */
  this.user_ = user;

  /**
   * Query-driven shard ID to use.
   * @type {string}
   * @private
   */
  this.overrideShardID_ = shardID;

  /**
   * Which item in the lobby is currently selected
   * @type {number}
   * @private
   */
  this.selectedID_ = undefined;

  /**
   * Which listItem DOM element is currently selected
   * @type {*}
   * @private
   */
  this.selectedListItem_ = undefined;
};

/**
 * Generate a new NetSimLobby object, putting
 * its markup within the provided element and returning
 * the controller object.
 * @param {HTMLElement} element The container for the lobby markup
 * @param {NetSimConnection} connection The connection manager to use
 * @param {DashboardUser} user The current user info
 * @param {string} [shardID] A particular shard ID to use, can be omitted which
 *        causes the system to look for user section shards, or generate a
 *        new one.
 * @return {NetSimLobby} A new controller for the generated lobby
 * @static
 */
NetSimLobby.createWithin = function (element, connection, user, shardID) {
  // Create a new NetSimLobby
  var controller = new NetSimLobby(connection, user, shardID);
  element.innerHTML = markup({});
  controller.bindElements_();
  controller.refresh_();
  return controller;
};

/**
 * Grab the DOM elements related to this control -once-
 * and bind them to member variables.
 * Also attach method handlers.
 */
NetSimLobby.prototype.bindElements_ = function () {
  // Root
  this.openRoot_ = $('#netsim_lobby_open');
  this.closedRoot_ = $('#netsim_lobby_closed');

  // Open
  this.displayNameView_ = this.openRoot_.find('#display_name_view');
  this.shardView_ = this.openRoot_.find('#shard_view');

  // Open -> display_name_view
  this.nameInput_ = this.displayNameView_.find('#netsim_lobby_name');
  this.setNameButton_ = this.displayNameView_.find('#netsim_lobby_set_name_button');
  dom.addClickTouchEvent(this.setNameButton_[0],
      this.setNameButtonClick_.bind(this));

  // Open -> shard_view
  this.shardSelector_ = this.shardView_.find('#netsim_shard_select');
  this.shardSelector_.change(this.onShardSelectorChange_.bind(this));
  this.notConnectedNote_ = this.shardView_.find('#netsim_not_connected_note');
  this.notConnectedNote_.hide();
  this.addRouterButton_ = this.shardView_.find('#netsim_lobby_add_router');
  dom.addClickTouchEvent(this.addRouterButton_[0],
      this.addRouterButtonClick_.bind(this));
  this.lobbyList_ = this.shardView_.find('#netsim_lobby_list');
  this.connectButton_ = this.shardView_.find('#netsim_lobby_connect');
  dom.addClickTouchEvent(this.connectButton_[0],
      this.connectButtonClick_.bind(this));

  // Closed
  this.disconnectButton_ = this.closedRoot_.find('#netsim_lobby_disconnect');
  dom.addClickTouchEvent(this.disconnectButton_[0],
      this.disconnectButtonClick_.bind(this));

  this.connectionStatusSpan_ = this.closedRoot_.find('#netsim_lobby_statusbar');

  // Collections
  this.shardLinks_ = $('.shardLink');

  // Initialization
  this.shardLinks_.hide();
  if (this.user_.isSignedIn) {
    this.nameInput_.val(this.user_.name);
    this.refreshShardList_();
  }
};

/**
 * Called whenever the connection notifies us that we've connected to,
 * or disconnected from, a shard.
 * @param {?NetSimShard} newShard - null if disconnected.
 * @private
 */
NetSimLobby.prototype.onShardChange_= function (newShard) {
  this.shard_ = newShard;
  if (this.shard_ !== null) {
    this.shard_.nodeTable.tableChange
        .register(this.onNodeTableChange_.bind(this));
    logger.info("NetSimLobby registered to nodeTable tableChange");
  }
};

/**
 * Called whenever a change is detected in the nodes table - which should
 * trigger a refresh of the lobby listing
 * @param {!Array} rows
 * @private
 */
NetSimLobby.prototype.onNodeTableChange_ = function (rows) {
  // Refresh lobby listing.
  var nodes = netsimUtils.nodesFromRows(this.shard_, rows);
  this.refreshLobbyList_(nodes);
};

NetSimLobby.prototype.setNameButtonClick_ = function () {
  this.nameInput_.prop('disabled', true);
  this.setNameButton_.hide();
  this.shardSelector_.attr('disabled', false);
  this.refreshShardList_();
};

/** Handler for picking a new shard from the dropdown. */
NetSimLobby.prototype.onShardSelectorChange_ = function () {
  if (this.connection_.isConnectedToShard()) {
    this.connection_.disconnectFromShard();
    this.nameInput_.disabled = false;
  }

  if (this.shardSelector_.val() !== SELECTOR_NONE_VALUE) {
    this.nameInput_.disabled = true;
    this.connection_.connectToShard(this.shardSelector_.val(),
        this.nameInput_.val());
  }
};

/** Handler for clicking the "Add Router" button. */
NetSimLobby.prototype.addRouterButtonClick_ = function () {
  this.connection_.addRouterToLobby();
};

/** Handler for clicking the "Connect" button. */
NetSimLobby.prototype.connectButtonClick_ = function () {
  if (!this.selectedID_) {
    return;
  }

  this.connection_.connectToRouter(this.selectedID_);
};

/** Handler for clicking the "disconnect" button. */
NetSimLobby.prototype.disconnectButtonClick_ = function () {
  this.connection_.disconnectFromRouter();
};

/**
 * Make an async request against the dashboard API to
 * reload and populate the user sections list.
 */
NetSimLobby.prototype.refreshShardList_ = function () {
  var self = this;
  // TODO (bbuchanan) : Use unique level ID when generating shard ID
  var levelID = 'demo';
  var shardSelector = this.shardSelector_;

  if (this.overrideShardID_ !== undefined) {
    this.useShard(this.overrideShardID_);
    return;
  }

  if (!this.user_.isSignedIn) {
    this.useRandomShard();
    return;
  }

  this.getUserSections_(function (data) {
    if (0 === data.length) {
      this.useRandomShard();
      return;
    }

    $(shardSelector).empty();

    if (data.length > 1) {
      // If we have more than one section, require the user
      // to pick one.
      $('<option>')
          .val(SELECTOR_NONE_VALUE)
          .html('-- PICK ONE --')
          .appendTo(shardSelector);
    }

    // Add all shards to the dropdown
    data.forEach(function (section) {
      // TODO (bbuchanan) : Put teacher names in sections
      $('<option>')
          .val('netsim_' + levelID + '_' + section.id)
          .html(section.name)
          .appendTo(shardSelector);
    });

    self.onShardSelectorChange_();
  });
};

/** Generates a new random shard ID and immediately selects it. */
NetSimLobby.prototype.useRandomShard = function () {
  this.useShard('netsim_' + utils.createUuid());
};

/**
 * Forces the shard selector to contain only the given option,
 * and immediately selects that option.
 * @param {!string} shardID - unique shard identifier
 */
NetSimLobby.prototype.useShard = function (shardID) {
  this.shardSelector_.empty();

  $('<option>')
      .val(shardID)
      .html('My Private Network')
      .appendTo(this.shardSelector_);

  this.shardLinks_
      .attr('href', this.buildShareLink(shardID))
      .show();

  this.onShardSelectorChange_();
};

NetSimLobby.prototype.buildShareLink = function (shardID) {
  var baseLocation = document.location.protocol + '//' +
      document.location.host + document.location.pathname;
  return baseLocation + '?s=' + shardID;
};

NetSimLobby.prototype.refresh_ = function () {
  if (this.connection_.isConnectedToRouter()) {
    this.refreshClosedLobby_();
  } else {
    this.refreshOpenLobby_();
  }
};

/**
 * Just show the status line and the disconnect button.
 * @private
 */
NetSimLobby.prototype.refreshClosedLobby_ = function () {
  this.closedRoot_.show();
  this.openRoot_.hide();

  this.notConnectedNote_.hide();

  // Update connection status
  this.connectionStatusSpan_.html(
      this.connection_.myNode.getStatus() + ' ' +
      this.connection_.myNode.getStatusDetail());

  // Share link state?

  // Disconnect button state?
};

/**
 * Show preconnect controls (name, shard-select) and actual lobby listing.
 * @private
 */
NetSimLobby.prototype.refreshOpenLobby_ = function () {
  this.openRoot_.show();
  this.closedRoot_.hide();

  // Do we have a name yet?
  if (this.nameInput_.val() === '') {
    this.nameInput_.prop('disabled', false);
    this.setNameButton_.show();

    this.shardView_.hide();
    return;
  }

  // We have a name
  this.nameInput_.prop('disabled', true);
  this.setNameButton_.hide();
  this.shardView_.show();

  // Do we have a shard yet?
  if (!this.connection_.isConnectedToShard()) {
    this.shardSelector_.val(SELECTOR_NONE_VALUE);
    this.notConnectedNote_.show();
    this.addRouterButton_.hide();
    this.lobbyList_.hide();
    this.connectButton_.hide();
    return;
  }

  // We have a shard
  this.notConnectedNote_.hide();
  this.addRouterButton_.show();
  this.lobbyList_.show();
  this.connectButton_.show();
  this.connection_.getAllNodes(function (lobbyData) {
    this.refreshLobbyList_(lobbyData);
  }.bind(this));
};

/**
 * Reload the lobby listing of nodes.
 * @param {!Array.<NetSimClientNode>} lobbyData
 * @private
 */
NetSimLobby.prototype.refreshLobbyList_ = function (lobbyData) {
  this.lobbyList_.empty();

  // TODO: Filter based on level configuration
  var filteredLobbyData = lobbyData.filter(function (simNode) {
    return simNode.getNodeType() === NetSimRouterNode.getNodeType();
  });

  filteredLobbyData.sort(function (a, b) {
    // TODO (bbuchanan): Make this sort localization-friendly.
    if (a.getDisplayName() > b.getDisplayName()) {
      return 1;
    }
    return -1;
  });

  this.selectedListItem_ = undefined;
  filteredLobbyData.forEach(function (simNode) {
    var item = $('<li>').html(
        simNode.getDisplayName() + ' : ' +
        simNode.getStatus() + ' ' +
        simNode.getStatusDetail());

    // Style rows by row type.
    if (simNode.getNodeType() === NetSimRouterNode.getNodeType()) {
      item.addClass('router_row');
    } else {
      item.addClass('user_row');
      if (simNode.entityID === this.connection_.myNode.entityID) {
        item.addClass('own_row');
      }
    }

    // Preserve selected item across refresh.
    if (simNode.entityID === this.selectedID_) {
      item.addClass('selected_row');
      this.selectedListItem_ = item;
    }

    dom.addClickTouchEvent(item[0], this.onRowClick_.bind(this, item, simNode));
    item.appendTo(this.lobbyList_);
  }.bind(this));

  this.onSelectionChange();
};

/**
 * @param {*} connectionTarget - Lobby row for clicked item
 * @private
 */
NetSimLobby.prototype.onRowClick_ = function (listItem, connectionTarget) {
  // Can't select user rows (for now)
  if (NetSimClientNode.getNodeType() === connectionTarget.getNodeType()) {
    return;
  }

  var oldSelectedID = this.selectedID_;
  var oldSelectedListItem = this.selectedListItem_;

  // Deselect old row
  if (oldSelectedListItem) {
    oldSelectedListItem.removeClass('selected_row');
  }
  this.selectedID_ = undefined;
  this.selectedListItem_ = undefined;

  // If we clicked on a different row, select the new row
  if (connectionTarget.entityID !== oldSelectedID) {
    this.selectedID_ = connectionTarget.entityID;
    this.selectedListItem_ = listItem;
    this.selectedListItem_.addClass('selected_row');
  }

  this.onSelectionChange();
};

/** Handler for selecting/deselcting a row in the lobby listing. */
NetSimLobby.prototype.onSelectionChange = function () {
  this.connectButton_.attr('disabled', (this.selectedListItem_ === undefined));
};

/**
 * Send a request to dashboard and retrieve a JSON array listing the
 * sections this user belongs to.
 * @param callback
 * @private
 */
NetSimLobby.prototype.getUserSections_ = function (callback) {
  // TODO (bbuchanan) : Get owned sections as well, to support teachers.
  // TODO (bbuchanan): Wrap this away into a shared library for the v2/sections api
  $.ajax({
    dataType: 'json',
    url: '/v2/sections/membership',
    success: callback
  });
};
