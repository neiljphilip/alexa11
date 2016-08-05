'use strict';

/**
 * When editing your questions pay attention to your punctuation. Make sure you use question marks or periods.
 * Make sure the first answer is the correct one. Set at least 4 answers, any extras will be shuffled in.
 */
var questions = [
    {
        "Do you take little interest or pleasure in doing things?": [
            "No",
            "Sometimes",
            "Regularly"
        ]
    },
    {
        "Do you feel down or hopeless?": [
            "No",
            "Sometimes",
            "Regularly"
        ]
    },
    {
        "Do you have trouble falling or staying asleep?": [
             "No",
            "Sometimes",
            "Regularly"
        ]
    },
    {
        "Do you sleep too much?" : [
             "No",
            "Sometimes",
            "Regularly"
            ]
    },
    {
        "Do you feel tired or have little energy? ": [
             "No",
            "Sometimes",
            "Regularly"
        ]
    },
    {
        "Have you lost your appetite? ": [
           "No",
            "Sometimes",
            "Regularly"
        ]
    },
    {
        "Are you overeating? ": [
          "No",
            "Sometimes",
            "Regularly"
        ]
    },
    {
        "Are you feeling bad about yourself, or like you are a failure or that you have let yourself or your family down? ": [
            "No",
            "Sometimes",
            "Regularly"
        ]
    },
    {
        "Do you have trouble concentrating on things, such as reading the newspaper or watching television? ": [
            "No",
            "Sometimes",
            "Yes"
        ]
    },
    {
        "Do you move or speak so slowly that other people have noticed?": [
            "No",
            "Sometimes",
            "Regularly"
        ]
    },
    {
        "Do you every have thoughts that you would be better off dead? ": [
             "No",
            "Sometimes",
            "Regularly"
        ]
    },
    {
        "Do you ever think about hurting yourself? ": [
            "No",
            "Sometimes",
            "Regularly"
        ]
    },
    {
        "Do you have difficulty making decisions?": [
             "No",
            "Sometimes",
            "Regularly"
        ]
    },
    {
        "Do you have difficulty remembering details? ": [
            "No",
            "Sometimes",
            "Regularly"
        ]
    },
    {
        "Do you have difficulty concentrating? ": [
           "No",
           "Sometimes",
            "Regularly"
        ]
    },
    {
        "Do you have persistent aches or pains, headaches, or cramps that do not ease even with treatment? ": [
            "No",
            "Sometimes",
            "Regularly"
        ]
    },
    {
        "Do you have restlessness? ": [
             "No",
            "Sometimes",
            "Regularly"
        ]
    },
    {
        "Do you feel fatigued? ": [
            "No",
            "Sometimes",
            "Regularly"
        ]
    }
];

exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */

 if (event.session.application.applicationId !== "amzn1.ask.skill.855c5e3b-f21c-4866-a291-314df0c77e52") {
      context.fail("Invalid Application ID");
 }

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};


/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId
        + ", sessionId=" + session.sessionId);

    // add any session init logic here
}

/**
 * Called when the user invokes the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId
        + ", sessionId=" + session.sessionId);

    getWelcomeResponse(callback);
}
/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId
        + ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    // handle yes/no intent after the user has been prompted
    if (session.attributes && session.attributes.userPromptedToContinue) {
        delete session.attributes.userPromptedToContinue;
        if ("AMAZON.NoIntent" === intentName) {
            handleFinishSessionRequest(intent, session, callback);
        } else if ("AMAZON.YesIntent" === intentName) {
            handleRepeatRequest(intent, session, callback);
        }
    }

    // dispatch custom intents to handlers here
    if ("AnswerIntent" === intentName) {
        handleAnswerRequest(intent, session, callback);
    } else if ("AnswerOnlyIntent" === intentName) {
        handleAnswerRequest(intent, session, callback);
    } else if ("AMAZON.YesIntent" === intentName) {
        handleAnswerRequest(intent, session, callback);
    } else if ("AMAZON.NoIntent" === intentName) {
        handleAnswerRequest(intent, session, callback);
    } else if ("AMAZON.StartOverIntent" === intentName) {
        getWelcomeResponse(callback);
    } else if ("AMAZON.RepeatIntent" === intentName) {
        handleRepeatRequest(intent, session, callback);
    } else if ("AMAZON.HelpIntent" === intentName) {
        handleGetHelpRequest(intent, session, callback);
    } else if ("DontKnowIntent" === intentName) {       
            handleAnswerRequest(intent, session, callback);
    } else if ("AMAZON.StopIntent" === intentName) {
        handleFinishSessionRequest(intent, session, callback);
    } else if ("AMAZON.CancelIntent" === intentName) {
        handleFinishSessionRequest(intent, session, callback);
    } else {
        throw "Invalid intent";
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId
        + ", sessionId=" + session.sessionId);

    // Add any cleanup logic here
}

var GAME_LENGTH = 18;
var ANSWER_COUNT = 3;
var CARD_TITLE = "Depression Assessment";

function getWelcomeResponse(callback){
    var sessionAttributes = {},
    speechOutput = "Wikipedia defines depression as, a state of low mood and aversion to activity that can affect a person's thoughts, behavior, feelings, and sense of well being.  I will ask you " + GAME_LENGTH.toString()
            + " questions, please answer these questions honestly to get an accurate assessment of your mental health. Let's begin. ",
            shouldEndSession = false,
            gameQuestions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
            correctAnswerIndex = 0, //roundAnswers deleted
            currentQuestionIndex = 0,
            roundAnswers = ["No", "Sometimes", "Regularly"],
            spokenQuestion = Object.keys(questions[gameQuestions[currentQuestionIndex]])[0],
            repromptText = "Question 1. " + spokenQuestion + " ",
            i, j;
            for (i = 0; i < ANSWER_COUNT; i++) {
                //repromptText += (i+1).toString() + ". " + Object.keys(questions[currentQuestionIndex])[i+1] + ". "
                repromptText += (i+1).toString() + ". " + roundAnswers[i] + ", "
            }
    speechOutput += repromptText;
    sessionAttributes = {
        "speechOutput": repromptText,
        "repromptText": repromptText,
        "currentQuestionIndex": currentQuestionIndex,
        "correctAnswerIndex": correctAnswerIndex,
        "questions": gameQuestions,
        "score": 0,
        "correctAnswerText":
            questions[gameQuestions[currentQuestionIndex]][Object.keys(questions[gameQuestions[currentQuestionIndex]])[0]][0]
        //correct answer not relevant
    };
    callback(sessionAttributes,
        buildSpeechletResponse(CARD_TITLE, speechOutput, repromptText, shouldEndSession));

}

function handleAnswerRequest(intent, session, callback) {
    var speechOutput = "";
    var sessionAttributes = {};
    var gameInProgress = session.attributes && session.attributes.questions;
    var answerSlotValid = isAnswerSlotValid(intent);
    var speechOutputAnalysis = "";
    var userGaveUp = intent.name === "DontKnowIntent";

    console.log("intent test " + intent);
    console.log(intent);

    if (!gameInProgress) {
        // If the user responded with an answer but there is no game in progress, ask the user
        // if they want to start a new game. Set a flag to track that we've prompted the user.
        sessionAttributes.userPromptedToContinue = true;
        speechOutput = "There is no test in progress. Do you want to administer a new test? ";
        callback(sessionAttributes,
            buildSpeechletResponse(CARD_TITLE, speechOutput, speechOutput, false));
    } else if (!answerSlotValid && !userGaveUp) {
        // If the user provided answer isn't a number > 0 and < ANSWER_COUNT,
        // return an error message to the user. Remember to guide the user into providing correct values.
        var reprompt = session.attributes.speechOutput;
        speechOutput = "Your answer must be a number between 1 and " + ANSWER_COUNT + ". " + reprompt;
        callback(session.attributes,
            buildSpeechletResponse(CARD_TITLE, speechOutput, reprompt, false));
    } else {
        var gameQuestions = session.attributes.questions,
            correctAnswerIndex = parseInt(session.attributes.correctAnswerIndex),
            currentScore = parseInt(session.attributes.score),
            currentQuestionIndex = parseInt(session.attributes.currentQuestionIndex),
            correctAnswerText = session.attributes.correctAnswerText;

        speechOutputAnalysis = "";

        if (answerSlotValid && parseInt(intent.slots.Answer.value) == correctAnswerIndex+1) {
            currentScore++;
        }
        // if currentQuestionIndex is 4, we've reached 5 questions (zero-indexed) and can exit the game session
        if (currentQuestionIndex == GAME_LENGTH - 1) {
            speechOutput = "";
            speechOutput += speechOutputAnalysis + "Your final score is " + currentScore.toString() + " out of "
                + GAME_LENGTH.toString() + ". ";
                if (currentScore > 12) {
                    speechOutput += "Although you may be feeling down, try spending time with friends or family.";
                }
                else if (currentScore > 7) {
                    speechOutput += "You may be suffering from depression. Seek further help.";
                }
                else {
                    speechOutput += "You are probably suffering from depression. Please seek professional help.";
                }
            callback(session.attributes,
                buildSpeechletResponse(CARD_TITLE, speechOutput, "", true));
        }
         else {
            currentQuestionIndex += 1;
            var spokenQuestion = Object.keys(questions[gameQuestions[currentQuestionIndex]])[0];
            // Generate a random index for the correct answer, from 0 to 3
            correctAnswerIndex = 0;
            var roundAnswers = ["No", "Sometimes", "Regularly"];

                var questionIndexForSpeech = currentQuestionIndex + 1,
                repromptText = "Question " + questionIndexForSpeech.toString() + ". " + spokenQuestion + " ";
            for (var i = 0; i < ANSWER_COUNT; i++) {
                repromptText += (i+1).toString() + ". " + roundAnswers[i] + ", "
            }
            //speechOutput += userGaveUp ? "" : "That answer is ";
            speechOutput += repromptText;

            sessionAttributes = {
                "speechOutput": repromptText,
                "repromptText": repromptText,
                "currentQuestionIndex": currentQuestionIndex,
                "correctAnswerIndex": correctAnswerIndex,
                "questions": gameQuestions,
                "score": currentScore,
                "correctAnswerText":
                    questions[gameQuestions[currentQuestionIndex]][Object.keys(questions[gameQuestions[currentQuestionIndex]])[0]][0]
            };
            callback(sessionAttributes,
                buildSpeechletResponse(CARD_TITLE, speechOutput, repromptText, false));
        }
    }
}

function handleRepeatRequest(intent, session, callback) {
    // Repeat the previous speechOutput and repromptText from the session attributes if available
    // else start a new game session
    if (!session.attributes || !session.attributes.speechOutput) {
        getWelcomeResponse(callback);
    } else {
        callback(session.attributes,
            buildSpeechletResponseWithoutCard(session.attributes.speechOutput, session.attributes.repromptText, false));
    }
}

function handleGetHelpRequest(intent, session, callback) {
    // Provide a help prompt for the user, explaining how the game is played. Then, continue the game
    // if there is one in progress, or provide the option to start another one.

    // Set a flag to track that we're in the Help state.
    session.attributes.userPromptedToContinue = true;

    // Do not edit the help dialogue. This has been created by the Alexa team to demonstrate best practices.

    var speechOutput = "I will ask you " + GAME_LENGTH + " questions. Respond with the number of the answer. "
        + "For example, say one, two, or three. To start a new test at any time, say, start test. "
        + "To repeat the last question, say, repeat. "
        + "Would you like to keep going?",
        repromptText = "To give an answer to a question, respond with the number of the answer . "
        + "Would you like to keep going?";
        var shouldEndSession = false;
    callback(session.attributes,
        buildSpeechletResponseWithoutCard(speechOutput, repromptText, shouldEndSession));
}

function handleFinishSessionRequest(intent, session, callback) {
    // End the session with a "Good bye!" if the user wants to quit the game
    callback(session.attributes,
        buildSpeechletResponseWithoutCard("Good bye!", "", true));
}

function isAnswerSlotValid(intent) {
    return !isNaN(parseInt(intent.slots.Answer.value)) && parseInt(intent.slots.Answer.value) < 4 && parseInt(intent.slots.Answer.value) > 0;
}

// ------- Helper functions to build responses -------


function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildSpeechletResponseWithoutCard(output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}
