'use strict';

/**
 * When editing your questions pay attention to your punctuation. Make sure you use question marks or periods.
 * Make sure the first answer is the correct one. Set at least 4 answers, any extras will be shuffled in.
 */
var questions = [
    {
        "Do you have cravings for the substance?": [
            "No",
            "Sometimes",
            "Regularly"
        ]
    },
    {
        "Do you have bouts of moodiness?": [
            "No",
            "Sometimes",
            "Regularly"
        ]
    },
    {
        "Do you suddenly have a bad temper? ": [
             "No",
            "Sometimes",
            "Regularly"
        ]
    },
    {
        "Do you have trouble focusing? ": [
             "No",
            "Sometimes",
            "Regularly"
            ]
    },
    {
        "Do you have feelings of being depressed an empty? ": [
             "No",
            "Sometimes",
            "Regularly"
        ]
    },
    {
        "Do you feel frustration or resentment? ": [
           "No",
            "Sometimes",
            "Regularly"
        ]
    },
    {
        "Do you feel a sudden increase in your appetite? ": [
          "No",
            "Sometimes",
            "Regularly"
        ]
    },
    {
        "Do you have insomnia?": [
            "No",
            "Sometimes",
            "Regularly"
        ]
    },
    {
        "Do you have hallucinations? ": [
            "No",
            "Sometimes",
            "Yes"
        ]
    },
    {
        "Do you have to make social or recreational sacrifices, such as turning down an invitation to go out with friends, because of the substance?": [
            "No",
            "Sometimes",
            "Regularly"
        ]
    },
    {
        "Do you take risks that you would not normally take to obtain the substance?": [
             "No",
            "Sometimes",
            "Regularly"
        ]
    },
    {
        "Dooes the substance make you engage in risky activities, such as driving fast? ": [
            "No",
            "Sometimes",
            "Regularly"
        ]
    },
    {
        "Do you tend to use the substance as a way of dealing with your problems?": [
             "No",
            "Sometimes",
            "Regularly"
        ]
    },
    {
        "Do you feel obsessed with the substance? ": [
            "No",
            "Sometimes",
            "Regularly"
        ]
    },
    {
        "Do you feel the need to isolate yourself when taking the substance? ": [
           "No",
           "Sometimes",
            "Regularly"
        ]
    },
    {
        "Do you have problems with the law as a result of the substance? ": [
            "No",
            "Sometimes",
            "Regularly"
        ]
    },
    {
        "Do you have relationship difficulties because of the substance? ": [
             "No",
            "Sometimes",
            "Regularly"
        ]
    },
    {
        "Do you have financial difficulties because of the substance? ": [
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

 //   if (event.session.application.applicationId !== "amzn1.ask.skill.6e5c876f-7507-4999-91ce-1b44b7e73c0f") {
   //      context.fail("Invalid Application ID");
    //}

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
var CARD_TITLE = "Addiction Assessment";

function getWelcomeResponse(callback){
    var sessionAttributes = {},
    speechOutput = "Wikipedia defines addiction, as a medical condition characterized by compulsive engagement in rewarding stimuli, despite adverse consequences. I will ask you " + GAME_LENGTH.toString()
            + " questions, please answer these questions honestly to get an accurate assessment of whether or not you show symptoms of substance addiction. Let's begin. ",
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
                    speechOutput += "You do not show many signs of substance abuse.";
                }
                else if (currentScore > 7) {
                    speechOutput += "You show some signs of substance abuse. Seek further help.";
                }
                else {
                    speechOutput += "You show serious signs of substance abuse. Please seek professional help.";
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
