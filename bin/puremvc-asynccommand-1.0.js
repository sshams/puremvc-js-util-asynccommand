/*
  PureMVC JS Utility - Async Command
  Copyright (c) 2014 Saad Shams, Cliff Hall
  Your reuse is governed by the Creative Commons Attribution 3.0 License
*/

(function (scope){
	
	if (null == scope)
	    scope = window;
	
	// if the global puremvc asynccommand namespace already exists, turn back now
	if (scope.puremvc.asynccommand)
	{
		return;
	}

 	/* implementation begin */

    
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
        var isAsync = commandInstance instanceof puremvc.asynccommand.AsyncCommand || commandInstance instanceof puremvc.asynccommand.AsyncMacroCommand;
        
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

    /* implementation end */
 	 
 	// define the puremvc global namespace and export the actors
    scope.puremvc.asynccommand = {};
 	scope.puremvc.asynccommand.AsyncCommand = AsyncCommand;
    scope.puremvc.asynccommand.AsyncMacroCommand = AsyncMacroCommand; 
 	
})(this); // the 'this' parameter will resolve to global scope in all environments