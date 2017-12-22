/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/


'use strict';

const Alexa = require('alexa-sdk');

const APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

const languageStrings = {
    'en': {
        translation: {
            SKILL_NAME: 'DragonSlayer',
            HELP_MESSAGE: 'You can say stop to quit skill',
            HELP_REPROMPT: 'What can I help you with?',
            STOP_MESSAGE: 'Goodbye!',
        },
    },
};
var playerHealth = 100;
var dragonHealth = 100;
const handlers = {
    'LaunchRequest': function () {
        this.emit('NewGame');
    },
    'NewGame': function () {
        playerHealth = 100;
        dragonHealth = 100;
        this.emit(':ask', 'Welcome to the game! You are now a fierce knight \
        locked in a battle with a deadly dragon. ' + healthReport() + promptMove());
    },
    'QuickAttack': function () {
        var yourAttackReport = '';
        var damage = attack(15, 0.1);
        if(damage == 0) {
            yourAttackReport += 'Your attack missed!';
        } else {
            yourAttackReport += 'You dealt ' + damage + ' damage! ';
        }
        dragonHealth -= damage;
        if(checkGameOver() == 1) {
            this.emit(':ask', 'Quick attack executed! ' + yourAttackReport + ' Having no health left, the dragon keels over and dies. You win! To play again,\
            say; new game');
        }
        var dragonAttack = attack(20, 0.2);
        var dragonAttackReport = 'The dragon strikes and';
        if(dragonAttack == 0) {
            dragonAttackReport += 'misses!';
        } else {
            dragonAttackReport += 'deals ' + dragonAttack + ' damage! ';
        }
        playerHealth -= dragonAttack;
        if(checkGameOver() == -1) {
            this.emit(':ask', 'Looks like you\'ve no health left. The dragon devours you. Game over! To play again,\
            say; new game; or say stop to exit the game');
        }
        
        this.emit(':ask', 'Quick attack executed! ' + yourAttackReport + dragonAttackReport + healthReport() + promptMove());
    },
    'HeavyAttack': function () {
        var yourAttackReport = '';
        var damage = attack(35, 0.4);
        if(damage == 0) {
            yourAttackReport += 'Your attack missed!';
        } else {
            yourAttackReport += 'You dealt ' + damage + ' damage! ';
        }
        dragonHealth -= damage;
        if(checkGameOver() == 1) {
            this.emit(':ask', 'Quick attack executed! ' + yourAttackReport + ' Having no health left, the dragon keels over and dies. You win! To play again,\
            say; new game or say stop to exit');
        }
        var dragonAttack = attack(20, 0.2);
        var dragonAttackReport = 'The dragon strikes and';
        if(dragonAttack == 0) {
            dragonAttackReport += 'misses!';
        } else {
            dragonAttackReport += 'deals ' + dragonAttack + ' damage! ';
        }
        playerHealth -= dragonAttack;
        if(checkGameOver() == -1) {
            this.emit(':ask', dragonAttackReport + 'Looks like you\'ve no health left. The dragon devours you. Game over! To play again,\
            say; new game or say stop to exit');
        }
        
        this.emit(':ask', 'Heavy attack executed! ' + yourAttackReport + dragonAttackReport + healthReport() + promptMove(), 'Please say that again?');
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', "You can say 'heavy attack' to launch a heavy attack with a higher damage but lower accuracy, or\
            say 'quick attack' to launch a quick attack with a lower damage but a much higher accuracy. Which attack would you like to execute?");
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
};

function healthReport() {
    return 'You have ' + playerHealth + ' health points and \
    the dragon has ' + dragonHealth + ' health points. ' ;
}

function attack(max, missChance) {
    var damage = Math.floor(Math.random() * (max + 1));
    if(Math.random() <= missChance) {
        damage = 0;
    }
    return damage;
}

function checkGameOver() {
    if(dragonHealth <= 0) {
        return 1;
    } else if(playerHealth <= 0) {
        return -1;
    } else {
        return 0;
    }
}

function promptMove() {
    return 'Do you want to execute a quick attack or a heavy attack?';
}
exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};