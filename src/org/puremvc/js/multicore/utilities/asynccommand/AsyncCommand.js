/**
 * @fileOverview
 * PureMVC Async Command Utility JS Native Port by Saad Shams
 * Copyright(c) 2006-2012 Futurescale, Inc., Some rights reserved.
 * Reuse governed by Creative Commons Attribution 3.0 
 * http://creativecommons.org/licenses/by/3.0/us/
 * @author Saad Shams
 */

/**
 * A base <code>IAsyncCommand</code> implementation.
 * 
 * <P>
 * Your subclass should override the <code>execute</code> 
 * method where your business logic will handle the <code>INotification</code>. </P>
 * 
 */

/**
 * Constructor
 * @method AsyncCommand
 # @extends SimpleCommand
 * @return 
 */
function AsyncCommand()  {
    puremvc.SimpleCommand.call(this);
}

AsyncCommand.prototype = new puremvc.SimpleCommand;
AsyncCommand.prototype.constructor = AsyncCommand;

/**
 * Registers the callback for a parent <code>AsyncMacroCommand</code>. 
 * @method setOnComplete
 * @param {} value The <code>AsyncMacroCommand</code> method to call on completion
 * @return 
 */
AsyncCommand.prototype.setOnComplete = function(value) {
    this._onComplete = value;
}

/**
 * Notify the parent <code>AsyncMacroCommand</code> that this command is complete.
 * <P>
 * Call this method from your subclass to signify that your asynchronous command
 * has finished.</P>
 * @method commandComplete
 * @return 
 */

AsyncCommand.prototype.commandComplete = function() {
    this._onComplete();
}

AsyncCommand.prototype._onComplete = null;