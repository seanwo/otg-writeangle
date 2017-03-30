'use strict';

const Alexa = require('alexa-sdk');
var APP_ID = undefined; // TODO replace with your app ID (OPTIONAL).

exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.resources = languageStrings;
    alexa.registerHandlers(
        entryPointHandlers,
        mainMenuHandlers,
        communicationsMenuHandlers,
        segmentationMenuHandlers,
        actionWalkThruMenuHandlers
    );
    alexa.execute();
};

const states = {
    MAINMENU: '_MAINMENU',
    COMMUNICATIONSMENU: "_COMMUNICATIONSMENU",
    SEGMENTATIONMENU: "_SEGMENATIONMENU",
    ACTIONWALKTHRUMENU: "_ACTIONWALKTHRUMENU"
};

var entryPointHandlers = {
    'NewSession': function () {
        this.attributes['session'] = {};
        var speechOutput = this.t("WELCOME_MESSAGE", this.t("SKILL_NAME"));
        this.handler.state = states.MAINMENU;
        this.emitWithState('MainMenu', speechOutput);
    },
    'Unhandled': function () {
        this.emit(':tell', this.t("UNEXPECTED"));
    },
    'SessionEndedRequest': function () {
        console.log('SessionEndedRequest');
    }
};

var mainMenuHandlers = Alexa.CreateStateHandler(states.MAINMENU, {
    'MainMenu': function (prefix) {
        var speechOutput = (prefix || "") + this.t("MAIN_MENU");
        var repromptSpeech = this.t("MAIN_MENU_REPROMPT");
        this.attributes["reprompt"] = repromptSpeech;
        this.emit(':ask', speechOutput, repromptSpeech);
    },
    'ListFeaturesIntent': function () {
        var speechOutput = this.t("FEATURE_LIST") + this.t("MAIN_MENU");
        var repromptSpeech = this.t("MAIN_MENU_REPROMPT");
        this.emit(':ask', speechOutput, repromptSpeech);
    },
    'FeatureCommunicationsIntent': function () {
        this.handler.state = states.COMMUNICATIONSMENU;
        this.emitWithState('CommunicationsMenu', this.t("COMMUNICATIONS_MENU_PREFIX"));
    },
    'FeatureSegmentationIntent': function () {
        this.handler.state = states.SEGMENTATIONMENU;
        this.emitWithState('SegmentationMenu', this.t("SEGMENTATION_MENU_PREFIX"));
    },
    'AMAZON.RepeatIntent': function () {
        this.handler.state = states.MAINMENU;
        this.emitWithState('MainMenu');
    },
    'AMAZON.CancelIntent': function () {
        var speechOutput = this.t("STOP_MESSAGE");
        this.emit(':tell', speechOutput);
    },
    'AMAZON.StopIntent': function () {
        var speechOutput = this.t("STOP_MESSAGE");
        this.emit(':tell', speechOutput);
    },
    'AMAZON.StartOverIntent': function () {
        this.handler.state = states.MAINMENU;
        this.emitWithState('MainMenu');
    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = this.t("HELP_MESSAGE_MAIN_MENU", this.t("HOW_CAN_I_HELP"));
        this.emit(':ask', speechOutput, speechOutput);
    },
    'Unhandled': function () {
        var speechOutput = this.t("NO_UNDERSTAND") + this.attributes["reprompt"];
        var repromptSpeech = this.t("HELP_ME");
        this.emit(':ask', speechOutput, repromptSpeech);
    },
    'SessionEndedRequest': function () {
        console.log('MAINMENU.SessionEndedRequest');
    }
});

var communicationsMenuHandlers = Alexa.CreateStateHandler(states.COMMUNICATIONSMENU, {
    'CommunicationsMenu': function (prefix) {
        var speechOutput = (prefix || "") + this.t("COMMUNICATIONS_MENU");
        var repromptSpeech = this.t("COMMUNICATIONS_MENU_REPROMPT");
        this.attributes["reprompt"] = repromptSpeech;
        this.emit(':ask', speechOutput, repromptSpeech);
    },
    'AMAZON.YesIntent': function () {
        var speechOutput = this.t("NOTIMPL");
        this.emit(':tell', speechOutput);
    },
    'AMAZON.NoIntent': function () {
        this.attributes['session'].exitState = states.COMMUNICATIONSMENU;
        this.attributes['session'].exitMenu = 'CommunicationsMenu';
        this.handler.state = states.SEGMENTATIONMENU;
        this.emitWithState('SegmentationMenu', this.t("SEGMENTATION_MENU_PREFIX"));
    },
    'AMAZON.RepeatIntent': function () {
        this.handler.state = states.COMMUNICATIONSMENU;
        this.emitWithState('CommunicationsMenu');
    },
    'AMAZON.CancelIntent': function () {
        var speechOutput = this.t("STOP_MESSAGE");
        this.emit(':tell', speechOutput);
    },
    'AMAZON.StopIntent': function () {
        var speechOutput = this.t("STOP_MESSAGE");
        this.emit(':tell', speechOutput);
    },
    'AMAZON.StartOverIntent': function () {
        this.handler.state = states.MAINMENU;
        this.emitWithState('MainMenu');
    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = this.t("HELP_MESSAGE_COMMUNICATIONS_MENU", this.t("HOW_CAN_I_HELP"));
        this.emit(':ask', speechOutput, speechOutput);
    },
    'Unhandled': function () {
        var speechOutput = this.t("NO_UNDERSTAND") + this.attributes["reprompt"];
        var repromptSpeech = this.t("HELP_ME");
        this.emit(':ask', speechOutput, repromptSpeech);
    },
    'SessionEndedRequest': function () {
        console.log('COMMUNICATIONSMENU.SessionEndedRequest');
    }
});

var segmentationMenuHandlers = Alexa.CreateStateHandler(states.SEGMENTATIONMENU, {
    'SegmentationMenu': function (prefix) {
        this.attributes['session'].actionState = states.SEGMENTATIONMENU;
        this.attributes['session'].actionMenu = 'SegmentationMenu';
        var speechOutput = (prefix || "") + this.t("SEGMENTATION_MENU");
        var repromptSpeech = this.t("SEGMENTATION_MENU_REPROMPT");
        this.attributes["reprompt"] = repromptSpeech;
        this.emit(':ask', speechOutput, repromptSpeech);
    },
    'AMAZON.YesIntent': function () {
        this.attributes['session'].action = 'CREATE_SEGMENT';
        this.attributes['session'].walkthru = this.t("SEGMENTATION_WALKTHRU");
        this.handler.state = states.ACTIONWALKTHRUMENU;
        this.emitWithState('ActionWalkThruMenu');
    },
    'AMAZON.NoIntent': function () {
        var speechOutput = this.t("NOTIMPL");
        this.emit(':tell', speechOutput);
    },
    'AMAZON.RepeatIntent': function () {
        this.handler.state = states.SEGMENTATIONMENU;
        this.emitWithState('SegmentationMenu');
    },
    'AMAZON.CancelIntent': function () {
        var speechOutput = this.t("STOP_MESSAGE");
        this.emit(':tell', speechOutput);
    },
    'AMAZON.StopIntent': function () {
        var speechOutput = this.t("STOP_MESSAGE");
        this.emit(':tell', speechOutput);
    },
    'AMAZON.StartOverIntent': function () {
        this.handler.state = this.attributes['session'].productState;
        this.emitWithState(this.attributes['session'].productMenu);
    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = this.t("HELP_MESSAGE_SEGMENTATION_MENU", this.t("HOW_CAN_I_HELP"));
        this.emit(':ask', speechOutput, speechOutput);
    },
    'Unhandled': function () {
        var speechOutput = this.t("NO_UNDERSTAND") + this.attributes["reprompt"];
        var repromptSpeech = this.t("HELP_ME");
        this.emit(':ask', speechOutput, repromptSpeech);
    },
    'SessionEndedRequest': function () {
        console.log('SEGMENTATIONMENU.SessionEndedRequest');
    }
});

var actionWalkThruMenuHandlers = Alexa.CreateStateHandler(states.ACTIONWALKTHRUMENU, {
    'ActionWalkThruMenu': function () {
        var speechOutput = this.t("ACTION_WALKTHRU_MENU", this.t(this.attributes['session'].action));
        this.attributes['session'].index = 0;
        this.handler.state = states.ACTIONWALKTHRUMENU;
        this.emitWithState('WalkThruSteps', speechOutput);
    },
    'WalkThruSteps': function (prefix) {
        var speechOutput = (prefix || "");
        if (this.attributes["session"].index < this.attributes["session"].walkthru.length) {
            speechOutput += this.attributes["session"].walkthru[this.attributes["session"].index];
        } else {
            if ((this.attributes['session'].exitState != undefined) && (this.attributes['session'].exitMenu != undefined)) {
                this.handler.state = this.attributes['session'].exitState;
                this.emitWithState(this.attributes['session'].exitMenu, this.t("WALKTHRU_COMPLETE"));
            } else {
                speechOutput += this.t("WALKTHRU_COMPLETE");
                this.emit(':tell', speechOutput);
            }
        }
        var repromptSpeech = this.t("ACTION_WALKTHRU_MENU_REPROMPT");
        this.attributes["reprompt"] = repromptSpeech;
        this.emit(':ask', speechOutput, repromptSpeech);
    },
    'AMAZON.NextIntent': function () {
        this.attributes['session'].index += 1;
        this.handler.state = states.ACTIONWALKTHRUMENU;
        this.emitWithState('WalkThruSteps');
    },
    'AMAZON.RepeatIntent': function () {
        this.handler.state = states.ACTIONWALKTHRUMENU;
        this.emitWithState('WalkThruSteps');
    },
    'AMAZON.CancelIntent': function () {
        var speechOutput = this.t("STOP_MESSAGE");
        this.emit(':tell', speechOutput);
    },
    'AMAZON.StopIntent': function () {
        var speechOutput = this.t("STOP_MESSAGE");
        this.emit(':tell', speechOutput);
    },
    'AMAZON.StartOverIntent': function () {
        this.handler.state = this.attributes['session'].actionState;
        this.emitWithState(this.attributes['session'].actionMenu);
    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = this.t("HELP_MESSAGE_ACTION_WALKTHRU_MENU", this.t("HOW_CAN_I_HELP"));
        this.emit(':ask', speechOutput, speechOutput);
    },
    'Unhandled': function () {
        var speechOutput = this.t("NO_UNDERSTAND") + this.attributes["reprompt"];
        var repromptSpeech = this.t("HELP_ME");
        this.emit(':ask', speechOutput, repromptSpeech);
    },
    'SessionEndedRequest': function () {
        console.log('ACTIONWALKTHRUMENU.SessionEndedRequest');
    }
});

const languageStrings = {
    "en-US": {
        "translation": {
            "SKILL_NAME": "Illuminate Me!",
            "WELCOME_MESSAGE": "Welcome to %s. ",
            "HOW_CAN_I_HELP": "How can I help you? ",
            "HELP_ME": "For instructions on what you can say, please say help me. ",
            "STOP_MESSAGE": "Goodbye! ",
            "NO_UNDERSTAND": "Sorry, I don't quite understand what you mean. ",
            "MAIN_MENU": "Ask me a question.  I am here to help! ",
            "MAIN_MENU_REPROMPT": "Ask me a question, say features, or just say help me. ",
            "HELP_MESSAGE_MAIN_MENU": "Ask me a question on what you need help with. Say features to hear a list of features. Say repeat to hear the commands again or you can say exit...Now, %s",
            "FEATURE_LIST": "I can help you with communications or segmentation. ",

            "COMMUNICATIONS_MENU_PREFIX": "Looks like you want to contact your constituents.  Let's get started. ",
            "COMMUNICATIONS_MENU": "You need to make a list of your constituents before you contact them.  Have you already created a group of constituents to contact?",
            "COMMUNICATIONS_MENU_REPROMPT": "Say yes if you have already created a group of constituents, say no if you need to create a new group of constituents, or say help me. ",
            "HELP_MESSAGE_COMMUNICATIONS_MENU": "Say yes if you have already created a group of constituents, say no if you need to create a new group of constituents.  Say repeat to hear the commands again.  Say start over to choose a new feature or you can say exit...Now, %s",

            "SEGMENTATION_MENU_PREFIX": "Looks like you want to segment your constituents into a group.  Let's get started. ",
            "SEGMENTATION_MENU": "In order to segment your constituents, you need to be logged in to Luminate Beta.  Are you logged in to Luminate Beta? ",
            "SEGMENTATION_MENU_REPROMPT": "Say yes if you are logged into Luminate Beta, say no if you are not yet logged into Luminate Beta, or say help me. ",
            "HELP_MESSAGE_SEGMENTATION_MENU": "Say yes if you are logged into Luminate Beta, say no if you are not yet logged into Luminate Beta.  Say repeat to hear the commands again.  Say start over to choose a new feature or you can say exit...Now, %s",

            "CREATE_SEGMENT": "Create a segment in Luminate Beta",

            "SEGMENTATION_WALKTHRU": [
                "Choose segmentation from the main menu. ",
                "Click on the plus sign in the new box to create a new list. ",
                "Select filters and then choose social. ",
                "Select the tags for the types of constituents you want in this segment. ",
                "Type a name and description for your list and then click save. ",
                "Click the Push to Luminate Online button to send your list to Luminate Online. Your list will display in the Groups list within Luminate Online when the information transfers. "
            ],

            "ACTION_WALKTHRU_MENU": "Let's walk through how to %s, say next after each step.  Let's begin. ",
            "ACTION_WALKTHRU_MENU_REPROMPT": "Say next for the next step.  Say repeat to hear the step again.  ",
            "HELP_MESSAGE_ACTION_WALKTHRU_MENU": "To hear the next step, say next.  To hear the step again, say repeat.  Say start over to choose a new action or you can say exit...Now, %s",
            "WALKTHRU_COMPLETE": "Walk through complete! ",

            "UNEXPECTED": "An unexpected error has occurred. Please try again later! ",
            "NOTIMPL": "This code path is not yet implemented. "
        }
    }
};
