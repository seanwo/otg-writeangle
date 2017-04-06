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
        segmentationMenuHandlers,
        newFeaturesMenuHandlers,
        actionWalkThruMenuHandlers
    );
    alexa.execute();
};

const states = {
    MAINMENU: '_MAINMENU',
    SEGMENTATIONMENU: "_SEGMENATIONMENU",
    NEWFEATURESMENU: "_NEWFEAUTRESMENU",
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
    'WinnerIntent': function () {
        var speechOutput = this.t("WINNER");
        this.emit(':tell', speechOutput);
    },
    'FeatureIntent': function () {
        var speechOutput = this.t("FEATURE_LIST") + this.t("MAIN_MENU");
        var repromptSpeech = this.t("MAIN_MENU_REPROMPT");
        this.emit(':ask', speechOutput, repromptSpeech);
    },
    'WhatsNewIntent': function () {
        this.handler.state = states.NEWFEATURESMENU;
        this.emitWithState('NewFeaturesMenu', this.t("NEWFEATURES_MENU_PREFIX"));
    },
    'ListIntent': function () {
        this.handler.state = states.SEGMENTATIONMENU;
        this.emitWithState('SegmentationMenu', this.t("SEGMENTATION_MENU_PREFIX"));
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

var newFeaturesMenuHandlers = Alexa.CreateStateHandler(states.NEWFEATURESMENU, {
    'NewFeaturesMenu': function (prefix) {
        var speechOutput = (prefix || "") + this.t("NEWFEATURES_MENU");
        var repromptSpeech = this.t("NEWFEATURES_MENU_REPROMPT");
        this.attributes["reprompt"] = repromptSpeech;
        this.emit(':ask', speechOutput, repromptSpeech);
    },
    'WinnerIntent': function () {
        var speechOutput = this.t("WINNER");
        this.emit(':tell', speechOutput);
    },
    'ListIntent': function () {
        this.handler.state = states.NEWFEATURESMENU;
        this.emitWithState('NewFeaturesMenu', this.t("NEWFEATURE_LIST_EXPLAIN"));
    },
    'FeatureDashboardIntent': function () {
        this.handler.state = states.NEWFEATURESMENU;
        this.emitWithState('NewFeaturesMenu', this.t("NEWFEATURE_DASHBOARDS_EXPLAIN"));
    },
    'FeatureAuthenticationIntent': function () {
        this.handler.state = states.NEWFEATURESMENU;
        this.emitWithState('NewFeaturesMenu', this.t("NEWFEATURE_AUTHENTICATION_EXPLAIN"));
    },
    'AMAZON.RepeatIntent': function () {
        this.handler.state = states.NEWFEATURESMENU;
        this.emitWithState('NewFeaturesMenu');
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
        var speechOutput = this.t("HELP_MESSAGE_NEWFEATURES_MENU", this.t("HOW_CAN_I_HELP"));
        this.emit(':ask', speechOutput, speechOutput);
    },
    'Unhandled': function () {
        var speechOutput = this.t("NO_UNDERSTAND") + this.attributes["reprompt"];
        var repromptSpeech = this.t("HELP_ME");
        this.emit(':ask', speechOutput, repromptSpeech);
    },
    'SessionEndedRequest': function () {
        console.log('NEWFEATURESMENU.SessionEndedRequest');
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
    'WinnerIntent': function () {
        var speechOutput = this.t("WINNER");
        this.emit(':tell', speechOutput);
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
        this.handler.state = states.MAINMENU;
        this.emitWithState('MainMenu');
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
            "MAIN_MENU_REPROMPT": "Ask me a question, say features, say what's new, or just say help me. ",
            "HELP_MESSAGE_MAIN_MENU": "Ask me a question on what you need help with. Say features to hear a list of features.  Say what's new to hear a list of new features.  Say repeat to hear the commands again or you can say exit...Now, %s",
            "FEATURE_LIST": "I can help you with lists. ",

            "WINNER": "Team Illuminate Me of course!",

            "NEWFEATURES_MENU_PREFIX": "OK! Let's learn about something new!",
            "NEWFEATURES_MENU": "I can tell you about lists, dashboards, and blackbaud authentication.  Which feature are you interested in hearing about? ",
            "NEWFEATURES_MENU_REPROMPT": "Say the name of the feature you want to hear about, or say help me. ",
            "HELP_MESSAGE_NEWFEATURES_MENU": "Say lists if you want to hear about lists, say dashboards if you want to hear about dashboards, say authentication if you want to hear about authentication.  Say repeat to hear the commands again.  Say start over to choose a new feature or you can say exit...Now, %s",

            "NEWFEATURE_LIST_EXPLAIN": "You're gonna love Lists! Check this out. Now you can apply filters to your constituents to focus on a specific audience. ",
            "NEWFEATURE_DASHBOARDS_EXPLAIN": "Dashboards are fantastic! They display data in really pretty graphs, so you can check the success of your programs and compare historical data and current data. ",
            "NEWFEATURE_AUTHENTICATION_EXPLAIN": "Get ready for convenience! Now you can log into Luminate Beta using the same login you already use for Blackbaud Community and Blackbaud University. ",

            "SEGMENTATION_MENU_PREFIX": "Sounds like you want to create a list of constituents.  Let's get started. ",
            "SEGMENTATION_MENU": "To create your list you need to be logged into Luminate Beta.  Are you logged into Luminate Beta? ",
            "SEGMENTATION_MENU_REPROMPT": "Say yes if you are logged into Luminate Beta, say no if you are not yet logged into Luminate Beta, or say help me. ",
            "HELP_MESSAGE_SEGMENTATION_MENU": "Say yes if you are logged into Luminate Beta, say no if you are not yet logged into Luminate Beta.  Say repeat to hear the commands again.  Say start over to choose a new feature or you can say exit...Now, %s",

            "CREATE_SEGMENT": "Create a list in Luminate Beta",

            "SEGMENTATION_WALKTHRU": [
                "Choose lists from the main menu. ",
                "Click on the plus sign to create a new list. ",
                "Type a name and description for your list and then click save. ",
                "Click the filters button that looks like a funnel. ",
                "Let's narrow down your list. In constituent basics, pick gender or donor status. In email and social, pick your preferences. In location, enter an address and a distance.",
                "Click apply filters to apply the selections you've made. ",
                "Click the Push to Luminate Online button to send your list to Luminate Online. Your list will display in the User Groups  within Groups in Luminate Online when the data transfers. "
            ],

            "ACTION_WALKTHRU_MENU": "Let's walk through how to %s, say next after each step.  Let's begin. ",
            "ACTION_WALKTHRU_MENU_REPROMPT": "Say next for the next step.  Say repeat to hear the step again.  ",
            "HELP_MESSAGE_ACTION_WALKTHRU_MENU": "To hear the next step, say next.  To hear the step again, say repeat.  Say start over to choose a new action or you can say exit...Now, %s",
            "WALKTHRU_COMPLETE": "You did it!  Good job! ",

            "UNEXPECTED": "An unexpected error has occurred. Please try again later! ",
            "NOTIMPL": "This code path is not yet implemented. "
        }
    }
};
