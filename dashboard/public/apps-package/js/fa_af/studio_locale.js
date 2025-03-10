var appLocale = {lc:{"ar":function(n){
  if (n === 0) {
    return 'zero';
  }
  if (n == 1) {
    return 'one';
  }
  if (n == 2) {
    return 'two';
  }
  if ((n % 100) >= 3 && (n % 100) <= 10 && n == Math.floor(n)) {
    return 'few';
  }
  if ((n % 100) >= 11 && (n % 100) <= 99 && n == Math.floor(n)) {
    return 'many';
  }
  return 'other';
},"en":function(n){return n===1?"one":"other"},"bg":function(n){return n===1?"one":"other"},"bn":function(n){return n===1?"one":"other"},"ca":function(n){return n===1?"one":"other"},"cs":function(n){
  if (n == 1) {
    return 'one';
  }
  if (n == 2 || n == 3 || n == 4) {
    return 'few';
  }
  return 'other';
},"da":function(n){return n===1?"one":"other"},"de":function(n){return n===1?"one":"other"},"el":function(n){return n===1?"one":"other"},"es":function(n){return n===1?"one":"other"},"et":function(n){return n===1?"one":"other"},"eu":function(n){return n===1?"one":"other"},"fa":function(n){return "other"},"fi":function(n){return n===1?"one":"other"},"fil":function(n){return n===0||n==1?"one":"other"},"fr":function(n){return Math.floor(n)===0||Math.floor(n)==1?"one":"other"},"gl":function(n){return n===1?"one":"other"},"he":function(n){return n===1?"one":"other"},"hi":function(n){return n===0||n==1?"one":"other"},"hr":function(n){
  if ((n % 10) == 1 && (n % 100) != 11) {
    return 'one';
  }
  if ((n % 10) >= 2 && (n % 10) <= 4 &&
      ((n % 100) < 12 || (n % 100) > 14) && n == Math.floor(n)) {
    return 'few';
  }
  if ((n % 10) === 0 || ((n % 10) >= 5 && (n % 10) <= 9) ||
      ((n % 100) >= 11 && (n % 100) <= 14) && n == Math.floor(n)) {
    return 'many';
  }
  return 'other';
},"hu":function(n){return "other"},"id":function(n){return "other"},"is":function(n){
    return ((n%10) === 1 && (n%100) !== 11) ? 'one' : 'other';
  },"it":function(n){return n===1?"one":"other"},"ja":function(n){return "other"},"ko":function(n){return "other"},"lt":function(n){
  if ((n % 10) == 1 && ((n % 100) < 11 || (n % 100) > 19)) {
    return 'one';
  }
  if ((n % 10) >= 2 && (n % 10) <= 9 &&
      ((n % 100) < 11 || (n % 100) > 19) && n == Math.floor(n)) {
    return 'few';
  }
  return 'other';
},"lv":function(n){
  if (n === 0) {
    return 'zero';
  }
  if ((n % 10) == 1 && (n % 100) != 11) {
    return 'one';
  }
  return 'other';
},"mk":function(n){return (n%10)==1&&n!=11?"one":"other"},"ms":function(n){return "other"},"mt":function(n){
  if (n == 1) {
    return 'one';
  }
  if (n === 0 || ((n % 100) >= 2 && (n % 100) <= 4 && n == Math.floor(n))) {
    return 'few';
  }
  if ((n % 100) >= 11 && (n % 100) <= 19 && n == Math.floor(n)) {
    return 'many';
  }
  return 'other';
},"nl":function(n){return n===1?"one":"other"},"no":function(n){return n===1?"one":"other"},"pl":function(n){
  if (n == 1) {
    return 'one';
  }
  if ((n % 10) >= 2 && (n % 10) <= 4 &&
      ((n % 100) < 12 || (n % 100) > 14) && n == Math.floor(n)) {
    return 'few';
  }
  if ((n % 10) === 0 || n != 1 && (n % 10) == 1 ||
      ((n % 10) >= 5 && (n % 10) <= 9 || (n % 100) >= 12 && (n % 100) <= 14) &&
      n == Math.floor(n)) {
    return 'many';
  }
  return 'other';
},"pt":function(n){return n===1?"one":"other"},"ro":function(n){
  if (n == 1) {
    return 'one';
  }
  if (n === 0 || n != 1 && (n % 100) >= 1 &&
      (n % 100) <= 19 && n == Math.floor(n)) {
    return 'few';
  }
  return 'other';
},"ru":function(n){
  if ((n % 10) == 1 && (n % 100) != 11) {
    return 'one';
  }
  if ((n % 10) >= 2 && (n % 10) <= 4 &&
      ((n % 100) < 12 || (n % 100) > 14) && n == Math.floor(n)) {
    return 'few';
  }
  if ((n % 10) === 0 || ((n % 10) >= 5 && (n % 10) <= 9) ||
      ((n % 100) >= 11 && (n % 100) <= 14) && n == Math.floor(n)) {
    return 'many';
  }
  return 'other';
},"sk":function(n){
  if (n == 1) {
    return 'one';
  }
  if (n == 2 || n == 3 || n == 4) {
    return 'few';
  }
  return 'other';
},"sl":function(n){
  if ((n % 100) == 1) {
    return 'one';
  }
  if ((n % 100) == 2) {
    return 'two';
  }
  if ((n % 100) == 3 || (n % 100) == 4) {
    return 'few';
  }
  return 'other';
},"sq":function(n){return n===1?"one":"other"},"sr":function(n){
  if ((n % 10) == 1 && (n % 100) != 11) {
    return 'one';
  }
  if ((n % 10) >= 2 && (n % 10) <= 4 &&
      ((n % 100) < 12 || (n % 100) > 14) && n == Math.floor(n)) {
    return 'few';
  }
  if ((n % 10) === 0 || ((n % 10) >= 5 && (n % 10) <= 9) ||
      ((n % 100) >= 11 && (n % 100) <= 14) && n == Math.floor(n)) {
    return 'many';
  }
  return 'other';
},"sv":function(n){return n===1?"one":"other"},"ta":function(n){return n===1?"one":"other"},"th":function(n){return "other"},"tr":function(n){return n===1?"one":"other"},"uk":function(n){
  if ((n % 10) == 1 && (n % 100) != 11) {
    return 'one';
  }
  if ((n % 10) >= 2 && (n % 10) <= 4 &&
      ((n % 100) < 12 || (n % 100) > 14) && n == Math.floor(n)) {
    return 'few';
  }
  if ((n % 10) === 0 || ((n % 10) >= 5 && (n % 10) <= 9) ||
      ((n % 100) >= 11 && (n % 100) <= 14) && n == Math.floor(n)) {
    return 'many';
  }
  return 'other';
},"ur":function(n){return n===1?"one":"other"},"vi":function(n){return "other"},"zh":function(n){return "other"}},
c:function(d,k){if(!d)throw new Error("MessageFormat: Data required for '"+k+"'.")},
n:function(d,k,o){if(isNaN(d[k]))throw new Error("MessageFormat: '"+k+"' isn't a number.");return d[k]-(o||0)},
v:function(d,k){appLocale.c(d,k);return d[k]},
p:function(d,k,o,l,p){appLocale.c(d,k);return d[k] in p?p[d[k]]:(k=appLocale.lc[l](d[k]-o),k in p?p[k]:p.other)},
s:function(d,k,p){appLocale.c(d,k);return d[k] in p?p[d[k]]:p.other}};
(window.blockly = window.blockly || {}).appLocale = {
"actor":function(d){return "بازیگر"},
"alienInvasion":function(d){return "حمله ی موجودات فضایی!"},
"backgroundBlack":function(d){return "سیاه"},
"backgroundCave":function(d){return "غار"},
"backgroundCloudy":function(d){return "ابری"},
"backgroundHardcourt":function(d){return "hardcourt"},
"backgroundNight":function(d){return "شب"},
"backgroundUnderwater":function(d){return "زیر آب"},
"backgroundCity":function(d){return "شهر"},
"backgroundDesert":function(d){return "بیابان"},
"backgroundRainbow":function(d){return "رنگین کمان"},
"backgroundSoccer":function(d){return "فوتبال"},
"backgroundSpace":function(d){return "فضا"},
"backgroundTennis":function(d){return "تنیس"},
"backgroundWinter":function(d){return "زمستان"},
"catActions":function(d){return "اقدامات"},
"catControl":function(d){return "حلقه ها"},
"catEvents":function(d){return "رویدادها"},
"catLogic":function(d){return "منطق"},
"catMath":function(d){return "ریاضی"},
"catProcedures":function(d){return "توابع"},
"catText":function(d){return "متن"},
"catVariables":function(d){return "متغیرها"},
"changeScoreTooltip":function(d){return "افزودن یا حذف یک امتیاز به امتیازات .\n"},
"changeScoreTooltipK1":function(d){return "افزودن یک امتیاز به امتیازات ."},
"continue":function(d){return "ادامه بده"},
"decrementPlayerScore":function(d){return "حذف امتیاز"},
"defaultSayText":function(d){return "ایجا تایپ کن"},
"emotion":function(d){return "حالت"},
"finalLevel":function(d){return "تبریک! شما پازل نهایی را حل کردید."},
"for":function(d){return "برای"},
"hello":function(d){return "سلام"},
"helloWorld":function(d){return "سلام دنیا!"},
"incrementPlayerScore":function(d){return "نمره امتیاز"},
"makeProjectileDisappear":function(d){return "ناپدید می شود"},
"makeProjectileBounce":function(d){return "پریدن"},
"makeProjectileBlueFireball":function(d){return "توپ آتشین آبی بساز"},
"makeProjectilePurpleFireball":function(d){return "توپ آتشین بنفش بساز"},
"makeProjectileRedFireball":function(d){return "توپ آتشین قرمز بساز"},
"makeProjectileYellowHearts":function(d){return "قلب زرد بساز"},
"makeProjectilePurpleHearts":function(d){return "قلب های بنفش بساز"},
"makeProjectileRedHearts":function(d){return "قلب های  قرمز بساز"},
"makeProjectileTooltip":function(d){return "موشکی که تازه برخورد کرده را ناپدید کنید یا بالا و پایین ببرید."},
"makeYourOwn":function(d){return "برنامه ی آزمایشگاه بازی خودتان را بسازید"},
"moveDirectionDown":function(d){return "پایین"},
"moveDirectionLeft":function(d){return "سمت چپ"},
"moveDirectionRight":function(d){return "سمت راست"},
"moveDirectionUp":function(d){return "بالا"},
"moveDirectionRandom":function(d){return "تصادفی"},
"moveDistance25":function(d){return "۲۰ پیکسل"},
"moveDistance50":function(d){return "۵۰ پیکسل"},
"moveDistance100":function(d){return "۱۰۰ پیکسل"},
"moveDistance200":function(d){return "۲۰۰ پیکسل"},
"moveDistance400":function(d){return "۴۰۰ پیکسل"},
"moveDistancePixels":function(d){return "پیکسل"},
"moveDistanceRandom":function(d){return "پیکسل های تصادفی"},
"moveDistanceTooltip":function(d){return "یک بازیگر رو در جهت خاص به فاصله خاصی حرکت بده ."},
"moveSprite":function(d){return "حرکت"},
"moveSpriteN":function(d){return "بازیگر را حرکت بده"+appLocale.v(d,"spriteIndex")+" "},
"toXY":function(d){return "به x,y"},
"moveDown":function(d){return "برو پایین"},
"moveDownTooltip":function(d){return "یک بازیگر رو پایین ببر ."},
"moveLeft":function(d){return "برو چپ"},
"moveLeftTooltip":function(d){return "یک بازیگر رو به چپ ببر ."},
"moveRight":function(d){return "برو راست"},
"moveRightTooltip":function(d){return "یک بازیگر رو به راست ببر ."},
"moveUp":function(d){return "برو بالا"},
"moveUpTooltip":function(d){return "یک بازیگر رو بالا ببر ."},
"moveTooltip":function(d){return "یک بازیگر رو حرکت بده ."},
"nextLevel":function(d){return "تبریک! شما این پازل را به اتمام رساندید."},
"no":function(d){return "نه"},
"numBlocksNeeded":function(d){return "این پازل می تواند با %1 از بلوکها حل شود."},
"ouchExclamation":function(d){return "اوخ!"},
"playSoundCrunch":function(d){return "صدای خرد شدن را پخش کن"},
"playSoundGoal1":function(d){return "صدای گل 1 را پخش کن"},
"playSoundGoal2":function(d){return "صدای گل 2 را پخش کن"},
"playSoundHit":function(d){return "صدای ضربه را پخش کن"},
"playSoundLosePoint":function(d){return "صدای از دست دادن امتیاز را پخش کن"},
"playSoundLosePoint2":function(d){return "صدای از دست دادن امتیاز دوم را پخش کن"},
"playSoundRetro":function(d){return "صدای قدیمی پخش کن"},
"playSoundRubber":function(d){return "صدای کش را پخش کن"},
"playSoundSlap":function(d){return "صدای دست زدن را پخش کن"},
"playSoundTooltip":function(d){return "صدای انتخاب شده را پخش کن."},
"playSoundWinPoint":function(d){return "صدای کسب امتیاز را پخش کن"},
"playSoundWinPoint2":function(d){return "صدای کسب امتیاز 2 را پخش کن"},
"playSoundWood":function(d){return "صدای چوب را پخش کن"},
"positionOutTopLeft":function(d){return "به جهت بالا و چپ"},
"positionOutTopRight":function(d){return "به جهت بالا و راست"},
"positionTopOutLeft":function(d){return "به جهت بالا و چپ بیرونی"},
"positionTopLeft":function(d){return "به موقعیت بالا سمت چپ"},
"positionTopCenter":function(d){return "به موقعیت وسط در بالا"},
"positionTopRight":function(d){return "به موقعیت بالا سمت راست"},
"positionTopOutRight":function(d){return "به جهت بالا و راست بیرونی"},
"positionMiddleLeft":function(d){return "به موقعیت وسط سمت چپ"},
"positionMiddleCenter":function(d){return "به موقعیت وسط"},
"positionMiddleRight":function(d){return "به موقعیت وسط سمت راست"},
"positionBottomOutLeft":function(d){return "به جهت پایین و چپ بیرونی"},
"positionBottomLeft":function(d){return "به موقعیت پایین سمت چپ"},
"positionBottomCenter":function(d){return "به موقعیت وسط در پایین"},
"positionBottomRight":function(d){return "به موقعیت پایین سمت راست"},
"positionBottomOutRight":function(d){return "به جهت پایین و راست بیرونی"},
"positionOutBottomLeft":function(d){return "به جهت پایین و چپ"},
"positionOutBottomRight":function(d){return "به جهت پایین و راست"},
"positionRandom":function(d){return "به موقعیت تصادفی"},
"projectileBlueFireball":function(d){return "توپ آتشین آبی"},
"projectilePurpleFireball":function(d){return "توپ آتشین بنفش"},
"projectileRedFireball":function(d){return "توپ آتشین قرمز"},
"projectileYellowHearts":function(d){return "قلب های زرذ"},
"projectilePurpleHearts":function(d){return "قلب های بنفش"},
"projectileRedHearts":function(d){return "قلب های قرمز"},
"projectileRandom":function(d){return "تصادفی"},
"projectileAnna":function(d){return "قلاب"},
"projectileElsa":function(d){return "درخشش"},
"projectileHiro":function(d){return "آدم آهنی کوچولو"},
"projectileBaymax":function(d){return "موشک"},
"projectileRapunzel":function(d){return "ماهی تابه"},
"projectileCherry":function(d){return "گیلاس"},
"projectileIce":function(d){return "یخ"},
"projectileDuck":function(d){return "اردک"},
"reinfFeedbackMsg":function(d){return "شما می توانید دکمه \"دوباره امتحان کنید\" را بفشارید تا به بازیتان برگردید."},
"repeatForever":function(d){return "تکرار بی‌پایان"},
"repeatDo":function(d){return "انجام بده"},
"repeatForeverTooltip":function(d){return "اجرای عملیات داخل این بلوک بطور مکرر تا زمانی که داستان ادامه دارد."},
"saySprite":function(d){return "گفتن"},
"saySpriteN":function(d){return "بازیگر می گوید"+appLocale.v(d,"spriteIndex")},
"saySpriteTooltip":function(d){return "نمایش یک بیان صحبت با متن مربوطه از طرف بازیگر مشخص شده."},
"saySpriteChoices_1":function(d){return "سلام!"},
"saySpriteChoices_2":function(d){return "حالت چطوره؟"},
"saySpriteChoices_3":function(d){return "این باحاله..."},
"scoreText":function(d){return "امتیاز: "+appLocale.v(d,"playerScore")},
"setBackground":function(d){return "مجموعه پس زمینه"},
"setBackgroundRandom":function(d){return "قراردادن زمینه تصادفی"},
"setBackgroundBlack":function(d){return "قراردادن زمینه سیاه"},
"setBackgroundCave":function(d){return "قراردادن زمینه غار"},
"setBackgroundCloudy":function(d){return "قراردادن زمینه ابری"},
"setBackgroundHardcourt":function(d){return "قراردادن زمینه زمخت"},
"setBackgroundNight":function(d){return "قراردادن زمینه شب"},
"setBackgroundUnderwater":function(d){return "قراردادن زمینه زیرآبی"},
"setBackgroundCity":function(d){return "رنگ پیش زمینه ی شهر رو تعیین کن"},
"setBackgroundDesert":function(d){return "رنگ پیش زمینه ی بیابان رو تعیین کن"},
"setBackgroundRainbow":function(d){return "رنگ پیش زمینه ی رنگین کمان رو تعیین کن"},
"setBackgroundSoccer":function(d){return "رنگ پیش زمینه ی فوتبال رو تعیین کن"},
"setBackgroundSpace":function(d){return "رنگ پیش زمینه ی فضا رو تعیین کن"},
"setBackgroundTennis":function(d){return "رنگ پیش زمینه ی تنیس رو تعیین کن"},
"setBackgroundWinter":function(d){return "رنگ پیش زمینه ی زمستان رو تعیین کن"},
"setBackgroundLeafy":function(d){return "پس زمينه برگی تنظیم کن"},
"setBackgroundGrassy":function(d){return "پس زمینه چمنی تنظیم کن"},
"setBackgroundFlower":function(d){return "پس زمینه گل تنظیم کن"},
"setBackgroundTile":function(d){return "پس زمینه کاشی تنظیم کن"},
"setBackgroundIcy":function(d){return "پس زمینه یخی تنظیم کن"},
"setBackgroundSnowy":function(d){return "پس زمینه برفی تنظیم کن"},
"setBackgroundTooltip":function(d){return "تعیین تصویر پس‌زمینه"},
"setEnemySpeed":function(d){return "سرعت دشمن را تعیین کن"},
"setPlayerSpeed":function(d){return "تنظیم سرعت پخش"},
"setScoreText":function(d){return "تنظیم امتیاز"},
"setScoreTextTooltip":function(d){return "نوشته را تنظیم می کند تا در ناحیه ی امتیاز نمایش داده شود."},
"setSpriteEmotionAngry":function(d){return "تبدیل احساس به حالت عصبانی"},
"setSpriteEmotionHappy":function(d){return "به خلق و خوی شاد"},
"setSpriteEmotionNormal":function(d){return "تبدیل احساس به حالت نرمال"},
"setSpriteEmotionRandom":function(d){return "تبدیل احساس به یک حالت تصادفی"},
"setSpriteEmotionSad":function(d){return "تبدیل احساس به حالت غمگین"},
"setSpriteEmotionTooltip":function(d){return "تعیین احساس بازیگر"},
"setSpriteAlien":function(d){return "تغییر تصویر به موجود فضایی"},
"setSpriteBat":function(d){return "تغییر تصویر به خفاش"},
"setSpriteBird":function(d){return "تصویر پرنده"},
"setSpriteCat":function(d){return "تصویر گربه"},
"setSpriteCaveBoy":function(d){return "تغییر تصویر به پسر غار نشین"},
"setSpriteCaveGirl":function(d){return "تغییر تصویر به دختر غار نیشن"},
"setSpriteDinosaur":function(d){return "تغییر تصویر به دایناسور"},
"setSpriteDog":function(d){return "تصویر سگ"},
"setSpriteDragon":function(d){return "تغییر تصویر به اژدها"},
"setSpriteGhost":function(d){return "تغییر تصویر به روح"},
"setSpriteHidden":function(d){return "به یک تصویر مخفی"},
"setSpriteHideK1":function(d){return "پنهان کردن"},
"setSpriteAnna":function(d){return "تصویر آنا"},
"setSpriteElsa":function(d){return "تصویر السا"},
"setSpriteHiro":function(d){return "تصویر Hiro"},
"setSpriteBaymax":function(d){return "تغییر تصویر به بایمکس"},
"setSpriteRapunzel":function(d){return "تصویر Rapunzel"},
"setSpriteKnight":function(d){return "تغییر تصویر به شوالیه"},
"setSpriteMonster":function(d){return "به تصویر هیولا"},
"setSpriteNinja":function(d){return "به تصویر ماسک نینجا"},
"setSpriteOctopus":function(d){return "به تصویر هشت پا"},
"setSpritePenguin":function(d){return "به تصویر پنگوئن"},
"setSpritePirate":function(d){return "به تصویر دزد دریایی"},
"setSpritePrincess":function(d){return "به تصویر شاهزاده خانم"},
"setSpriteRandom":function(d){return "به یک تصویر تصادفی"},
"setSpriteRobot":function(d){return "به تصویر ربات"},
"setSpriteShowK1":function(d){return "نشان می دهد"},
"setSpriteSpacebot":function(d){return "به تصویر ربات فضایی"},
"setSpriteSoccerGirl":function(d){return "به تصویر دختر فوتبالیست"},
"setSpriteSoccerBoy":function(d){return "به تصویر پسر فوتبالیست"},
"setSpriteSquirrel":function(d){return "به تصویر سنجاب"},
"setSpriteTennisGirl":function(d){return "به تصویر دختر تنیسور"},
"setSpriteTennisBoy":function(d){return "به تصویر پسر تنیسور"},
"setSpriteUnicorn":function(d){return "به تصویر تک شاخ"},
"setSpriteWitch":function(d){return "به تصویر جادوگر"},
"setSpriteWizard":function(d){return "به تصویر جادوگر"},
"setSpritePositionTooltip":function(d){return "بلافاصله بازیگر را به موقعیت مشخص شده حرکت می‌دهد."},
"setSpriteK1Tooltip":function(d){return "بازیگر مشخص شده را نشان می دهد یا پنهان می کند ."},
"setSpriteTooltip":function(d){return "تعیین تصویر بازیگر"},
"setSpriteSizeRandom":function(d){return "به اندازه تصادفی"},
"setSpriteSizeVerySmall":function(d){return "به اندازه بسیار کوچک"},
"setSpriteSizeSmall":function(d){return "به اندازه کوچک"},
"setSpriteSizeNormal":function(d){return "به اندازه معمولی"},
"setSpriteSizeLarge":function(d){return "به اندازه بزرگ"},
"setSpriteSizeVeryLarge":function(d){return "به اندازه بسیار بزرگ"},
"setSpriteSizeTooltip":function(d){return "اندازه را برای یک بازیگر مشخص کن"},
"setSpriteSpeedRandom":function(d){return "به یک سرعت تصادفی"},
"setSpriteSpeedVerySlow":function(d){return "به سرعت خیلی آهسته"},
"setSpriteSpeedSlow":function(d){return "به سرعت آهسته"},
"setSpriteSpeedNormal":function(d){return "به سرعت معمولی"},
"setSpriteSpeedFast":function(d){return "به سرعت سریع"},
"setSpriteSpeedVeryFast":function(d){return "به سرعت خیلی سریع"},
"setSpriteSpeedTooltip":function(d){return "تعیین سرعت یک بازیگر"},
"setSpriteZombie":function(d){return "به تصویر زامبی"},
"shareStudioTwitter":function(d){return "داستانی که ساخته‌ام را ببین. من خودم آن را با @codeorg نوشته‌ام"},
"shareGame":function(d){return "داستانت را به اشتراک بگذار:"},
"showCoordinates":function(d){return "نشان دادن مختصات"},
"showCoordinatesTooltip":function(d){return "نشان دادن مختصات بازیگر اصلی در صفحه"},
"showTitleScreen":function(d){return "نمایش عنوان صفحه"},
"showTitleScreenTitle":function(d){return "عنوان"},
"showTitleScreenText":function(d){return "متن"},
"showTSDefTitle":function(d){return "عنوان را اینجا بنویس"},
"showTSDefText":function(d){return "متن را اینجا بنویس"},
"showTitleScreenTooltip":function(d){return "یک صفحه ی عنوان با عنوان و نوشته ی مرتبط نشان دهید."},
"size":function(d){return "اندازه"},
"setSprite":function(d){return "مجموعه"},
"setSpriteN":function(d){return "عملگر را تنظیم کنید "+appLocale.v(d,"spriteIndex")},
"soundCrunch":function(d){return "خرد شدن"},
"soundGoal1":function(d){return "هدف 1"},
"soundGoal2":function(d){return "هدف 2"},
"soundHit":function(d){return "آمار"},
"soundLosePoint":function(d){return "صدای از دست دادن امتیاز"},
"soundLosePoint2":function(d){return "از دست دادن نقطه ای 2"},
"soundRetro":function(d){return "یکپارچه سازی با سیستم عامل"},
"soundRubber":function(d){return "صدای پلاستیک"},
"soundSlap":function(d){return "سیلی"},
"soundWinPoint":function(d){return "صدای برنده شدن امتیاز"},
"soundWinPoint2":function(d){return "صدای برنده شدن امتیاز ۲"},
"soundWood":function(d){return "چوب"},
"speed":function(d){return "سرعت"},
"startSetValue":function(d){return "شروع (تابع ارتفاع موشک)"},
"startSetVars":function(d){return "game_vars (title, subtitle, background, target, danger, player)"},
"startSetFuncs":function(d){return "game_funcs (update-target, update-danger, update-player, collide?, on-screen?)"},
"stopSprite":function(d){return "بایست"},
"stopSpriteN":function(d){return "توقف بازیگر "+appLocale.v(d,"spriteIndex")},
"stopTooltip":function(d){return "حرکت یک عملگر را متوقف می کند."},
"throwSprite":function(d){return "پرتاب"},
"throwSpriteN":function(d){return "عملگر "+appLocale.v(d,"spriteIndex")+" پرتاب"},
"throwTooltip":function(d){return "یک موشک را از عملگر مشخصی پرتاب می کند."},
"vanish":function(d){return "ناپدید شدن"},
"vanishActorN":function(d){return "ناپدید شدن بازیگر "+appLocale.v(d,"spriteIndex")},
"vanishTooltip":function(d){return "ناپدید کردن بازیگر."},
"waitFor":function(d){return "منتظر ماندن برای"},
"waitSeconds":function(d){return "ثانیه"},
"waitForClick":function(d){return "برای کلیک کردن صبر کنید"},
"waitForRandom":function(d){return "منتظر انتخاب تصادفی باشید"},
"waitForHalfSecond":function(d){return "برای نیم ثانیه صبر کنید"},
"waitFor1Second":function(d){return "برای 1 ثانیه صبر کنید"},
"waitFor2Seconds":function(d){return "برای 2 ثانیه صبر کنید"},
"waitFor5Seconds":function(d){return "برای 5 ثانیه صبر کنید"},
"waitFor10Seconds":function(d){return "برای 10 ثانیه صبر کنید"},
"waitParamsTooltip":function(d){return "به مقدار ثانیه های مشخصی وقفه ایجاد کنید یا از صفر استفاده کنید برای ایجاد وقفه  تا زمانی که کلیک  کردن رخ بدهد."},
"waitTooltip":function(d){return "وقفه ای ایجاد کنید به مقدار زمان مشخصی  یا تا زمانی که کلیک کردن رخ دهد."},
"whenArrowDown":function(d){return "فلش سمت پایین"},
"whenArrowLeft":function(d){return "فلش سمت چپ"},
"whenArrowRight":function(d){return "فلش سمت راست"},
"whenArrowUp":function(d){return "فلش سمت بالا"},
"whenArrowTooltip":function(d){return "وقتی کلید جهت دار مشخصی فشرده شده است عملیات زیر را اجرا میکند."},
"whenDown":function(d){return "وقتی که پیکان پایین"},
"whenDownTooltip":function(d){return "کارهای زیر را انجام بده وقتی که کلید جهت پایین فشار داده میشود."},
"whenGameStarts":function(d){return "وقتی که داستان شروع می شود"},
"whenGameStartsTooltip":function(d){return "وقتی که داستان شروع می شود اقدامات زیر را انجام دهید."},
"whenLeft":function(d){return "وقتی که پیکان چپ"},
"whenLeftTooltip":function(d){return "کارهای زیر را انجام بده وقتی که کلید فلش چپ فشار داده می شود."},
"whenRight":function(d){return "وقتی که پیکان راست"},
"whenRightTooltip":function(d){return "کارهای زیر را انجام بده وقتی که کلید جهت راست فشار داده می شود."},
"whenSpriteClicked":function(d){return "وقتی که  بازیگر کلیک کرد"},
"whenSpriteClickedN":function(d){return "هنگامی که بر روی بازیگر "+appLocale.v(d,"spriteIndex")+" کلیک شده است"},
"whenSpriteClickedTooltip":function(d){return "اجرای عملیات زیر هنگام کلیک روی یک بازیگر."},
"whenSpriteCollidedN":function(d){return "هنگامی که بازیگر "+appLocale.v(d,"spriteIndex")},
"whenSpriteCollidedTooltip":function(d){return "اجرای عملیات زیر هنگامیکه یک بازیگر به بازیگر دیگری می‌زسد."},
"whenSpriteCollidedWith":function(d){return "لمس"},
"whenSpriteCollidedWithAnyActor":function(d){return "تماس داشتن با هر بازیگری"},
"whenSpriteCollidedWithAnyEdge":function(d){return "لمس هر لبه"},
"whenSpriteCollidedWithAnyProjectile":function(d){return "تماس داشتن با هر مسیر حرکت"},
"whenSpriteCollidedWithAnything":function(d){return "تماس داشتن با هر چیزی"},
"whenSpriteCollidedWithN":function(d){return "تماس داشتن با بازیگر "+appLocale.v(d,"spriteIndex")},
"whenSpriteCollidedWithBlueFireball":function(d){return "تماس داشتن با گلوله آتشین آبی"},
"whenSpriteCollidedWithPurpleFireball":function(d){return "تماس داشتن با گلوله آتشین بنفش"},
"whenSpriteCollidedWithRedFireball":function(d){return "تماس داشتن با گلوله آتشین قرمز"},
"whenSpriteCollidedWithYellowHearts":function(d){return "تماس داشتن با قلب های زرد"},
"whenSpriteCollidedWithPurpleHearts":function(d){return "تماس داشتن با قلب های بنفش"},
"whenSpriteCollidedWithRedHearts":function(d){return "تماس داشتن با قلب های قرمز"},
"whenSpriteCollidedWithBottomEdge":function(d){return "تماس داشتن با لبه ی پایینی"},
"whenSpriteCollidedWithLeftEdge":function(d){return "تماس داشتن با لبه ی چپ"},
"whenSpriteCollidedWithRightEdge":function(d){return "تماس داشتن با لبه ی راست"},
"whenSpriteCollidedWithTopEdge":function(d){return "تماس داشتن با لبه ی بالا"},
"whenUp":function(d){return "وقتی که پیکان بالا"},
"whenUpTooltip":function(d){return "کارهای زیر را انجام بده هنگامیکه کلید جهت بالا زده می‌شود."},
"yes":function(d){return "بله"}};