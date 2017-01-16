(function() {
  var ZeroChat,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ZeroChat = (function(_super) {
    __extends(ZeroChat, _super);

    function ZeroChat() {
      return ZeroChat.__super__.constructor.apply(this, arguments);
    }

    return ZeroChat;

  })(ZeroFrame);

  window.Page = new ZeroChat();

}).call(this);
