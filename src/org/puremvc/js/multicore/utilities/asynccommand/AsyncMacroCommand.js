/**
 * @fileOverview
 * PureMVC Async Command Utility JS Native Port by Saad Shams
 * Copyright(c) 2006-2012 Futurescale, Inc., Some rights reserved.
 * Reuse governed by Creative Commons Attribution 3.0 
 * http://creativecommons.org/licenses/by/3.0/us/
 * @author saad.shams@puremvc.org 
 */

/**
 * Constructor. 
 * 
 * <P>
 * You should not need to define a constructor, 
 * instead, override the <code>initializeAsyncMacroCommand</code>
 * method.</P>
 * 
 * <P>
 * If your subclass does define a constructor, be 
 * sure to call <code>super()</code>.</P>
 *
 * @method AsyncMacroCommand
 * @return 
 */
function AsyncMacroCommand() {
    puremvc.Notifier.call(this);
    this.subCommands = [];
    this.initializeAsyncMacroCommand();
}

AsyncMacroCommand.prototype = new puremvc.Notifier;
AsyncMacroCommand.prototype.constructor = AsyncMacroCommand;

/**
 * Add a <i>SubCommand</i>.
 * <P>
 * The <i>SubCommands</i> will be called in First In/First Out (FIFO)
 * order.</P>
 * @method addSubCommand 
 * @param {function} commandClassRef a reference to the <code>Class</code> of the <code>ICommand</code>.
 * @return 
 */
AsyncMacroCommand.prototype.addSubCommand = function(commandClassRef) {
    this.subCommands.push(commandClassRef);
}

/**
 * Registers the callback for a parent <code>AsyncMacroCommand</code>.  
 * @method setOnComplete
 * @param {function} value
 * @return 
 */
AsyncMacroCommand.prototype.setOnComplete = function(value) {
    this._onComplete = value;
}

/**
 * Starts execution of this <code>AsyncMacroCommand</code>'s <i>SubCommands</i>.
 * 
 * <P>
 * The <i>SubCommands</i> will be called in First In/First Out (FIFO) order.
 * </P> 
 *
 * @method execute
 * @param {Notification} notification
 * @return 
 */
AsyncMacroCommand.prototype.execute = function(notification) {
    this._notification = notification;
    this.nextCommand();
}


/**
 * Execute this <code>AsyncMacroCommand</code>'s next <i>SubCommand</i>.
 * 
 * <P>
 * If the next <i>SubCommand</i> is asynchronous, a callback is registered for
 * the command completion, else the next command is run.</P>  
 *
 * @method nextCommand
 * @return 
 */
AsyncMacroCommand.prototype.nextCommand = function() {
    if(this.subCommands.length > 0) {
        var commandClassRef = this.subCommands.shift();
        var commandInstance = new commandClassRef();        
        var isAsync = commandInstance instanceof puremvc.asynccommand.AsyncCommand;
        
        var self = this;
        if(isAsync) commandInstance.setOnComplete(function(){self.nextCommand()});
        commandInstance.initializeNotifier(this.multitonKey);
        commandInstance.execute(this._notification);
        if(!isAsync) this.nextCommand();
    } else {
        if(this._onComplete != null) this._onComplete();
        this._notification = null;
        this._onComplete = null;
    }
}

AsyncMacroCommand.prototype._onComplete = null;
AsyncMacroCommand.prototype.subCommands = null;
AsyncMacroCommand.prototype._notification = null;