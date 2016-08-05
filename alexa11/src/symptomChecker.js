'use strict';

/**
 * When editing your questions pay attention to your punctuation. Make sure you use question marks or periods.
 * Make sure the first answer is the correct one. Set at least 4 answers, any extras will be shuffled in.
 */
var questions = [
    {
        "What is a symptom you are experiencing?": [
            "No",
            "Sometimes",
            "Regularly"
        ]
    },
    {
        "What is a symptom you are experiencing?": [
            "No",
            "Sometimes",
            "Regularly"
        ]
    },
    {
        "What is a symptom you are experiencing?": [
            "No",
            "Sometimes",
            "Regularly"
        ]
    },
    {
        "What is a symptom you are experiencing?": [
            "No",
            "Sometimes",
            "Regularly"
        ]
    },
    {
        "What is a symptom you are experiencing?": [
            "No",
            "Sometimes",
            "Regularly"
        ]
    },
    {
        "What is a symptom you are experiencing?": [
            "No",
            "Sometimes",
            "Regularly"
        ]
    },
    {
        "What is a symptom you are experiencing?": [
            "No",
            "Sometimes",
            "Regularly"
        ]
    },
    {
        "What is a symptom you are experiencing?": [
            "No",
            "Sometimes",
            "Regularly"
        ]
    },
    {
        "What is a symptom you are experiencing?": [
            "No",
            "Sometimes",
            "Regularly"
        ]
    },
    {
        "What is a symptom you are experiencing?": [
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
var CARD_TITLE = "Quiz";

function getWelcomeResponse(callback){
    var sessionAttributes = {},
    speechOutput = "Hello, I will ask you to tell me your symptoms and based on your response, I will try to determine why you're not feeling well. Let's begin. ",
            shouldEndSession = false,
            gameQuestions = [0, 1, 2, 3, 4, 5, 6, 7],
            correctAnswerIndex = 0, //roundAnswers deleted
            currentQuestionIndex = 0,
            roundAnswers = ["No", "Sometimes", "Regularly"],
            spokenQuestion = Object.keys(questions[gameQuestions[currentQuestionIndex]])[0],
            repromptText = "What is a symptom you are experiencing? ",
            i, j;
    speechOutput += repromptText;
    sessionAttributes = {
        "speechOutput": repromptText,
        "repromptText": repromptText,
        "currentQuestionIndex": currentQuestionIndex,
        "correctAnswerIndex": correctAnswerIndex,
        "questions": gameQuestions,
        "coldScore": 0,
        "fluScore": 0,
        "pneumoniaScore": 0,
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
    var coldScore = parseInt(session.attributes.coldScore);
    var fluScore = parseInt(session.attributes.fluScore);
    var pneumoniaScore = parseInt(session.attributes.pneumoniaScore);

    console.log("intent test " + intent);
    console.log(intent);

    if (!gameInProgress) {
        // If the user responded with an answer but there is no game in progress, ask the user
        // if they want to start a new game. Set a flag to track that we've prompted the user.
        sessionAttributes.userPromptedToContinue = true;
        speechOutput = "There is no check in progress. Do you want to administer a new check? ";
        callback(sessionAttributes,
            buildSpeechletResponse(CARD_TITLE, speechOutput, speechOutput, false));
    }
    else {
        var gameQuestions = session.attributes.questions,
            correctAnswerIndex = parseInt(session.attributes.correctAnswerIndex),
            currentScore = parseInt(session.attributes.score),
            currentQuestionIndex = parseInt(session.attributes.currentQuestionIndex),
            correctAnswerText = session.attributes.correctAnswerText;

        speechOutputAnalysis = "";

        if (answerSlotValid && intent.slots.Answer.value == "sore throat") {
            coldScore++;
            fluScore++;
            pneumoniaScore++;
        }
        else if (answerSlotValid && intent.slots.Answer.value == "runny nose") {
            coldScore++;
            fluScore++;
        }
        else if (answerSlotValid && intent.slots.Answer.value == "congestion") {
            coldScore++;
            fluScore++;
        }
        else if (answerSlotValid && intent.slots.Answer.value == "cough") {
            coldScore++;
            fluScore++;
            pneumoniaScore++;
        }
        else if (answerSlotValid && (intent.slots.Answer.value == "fever" || intent.slots.Answer.value == "chills")) {
            fluScore++;
            pneumoniaScore++;
        }
        else if (answerSlotValid && intent.slots.Answer.value == "headache") {
            fluScore++;
        }
        else if (answerSlotValid && (intent.slots.Answer.value == "muscle soreness" || intent.slots.Answer.value == "muscle aches")) {
            fluScore++;
            pneumoniaScore++;
        }
        else if (answerSlotValid && intent.slots.Answer.value == "fatigue") {
            pneumoniaScore++;
        }
        else if (answerSlotValid && intent.slots.Answer.value == "enlarged lymph nodes") {
            pneumoniaScore++;
        }
        else if (answerSlotValid && intent.slots.Answer.value == "chest pain") {
            pneumoniaScore++;
        }
        else if (answerSlotValid && intent.slots.Answer.value == "shortness of breath") {
            pneumoniaScore++;
        }
        if (answerSlotValid && intent.slots.Answer.value == "no more") {
            speechOutput = "";
            if (fluScore > coldScore && fluScore > pneumoniaScore) {
                speechOutput = "You probably have the flu. You should seek medical attention.";
            }
            else if (fluScore + coldScore + pneumoniaScore === 0) {
                speechOutput = "I'm sorry, I can't seem to figure out why you're not feeling well. Please seek medical assistance.";
            }
            else if (fluScore == coldScore && fluScore > pneumoniaScore) {
                speechOutput = "You probably have a cold but you may have the flu. Over-the-counter cold medicine can be used to relieve these symptoms. If you experience fever, headache, or muscle soreness, you should seek medical attention.";
            }
            else if (pneumoniaScore == fluScore) {
                speechOutput = "You probably have a cold but you may have the flu or pneumonia. Over-the-counter cold medicine can be used to relieve these symptoms. If you experience fever, headache, or muscle soreness, you should seek medical attention.";0
            }
            else if (pneumoniaScore > fluScore) {
                speechOutput = "You probably have pneumonia. You should seek medical attention.";
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
            var repromptText = "Is there another symptom you are experiencing? If not, say no more. ";
            //speechOutput += userGaveUp ? "" : "That answer is ";
            speechOutput = repromptText;

            sessionAttributes = {
                "speechOutput": repromptText,
                "repromptText": repromptText,
                "currentQuestionIndex": currentQuestionIndex,
                "correctAnswerIndex": correctAnswerIndex,
                "questions": gameQuestions,
                "coldScore": coldScore,
                "fluScore": fluScore,
                "pneumoniaScore": pneumoniaScore,
                "correctAnswerText":
                    questions[gameQuestions[currentQuestionIndex]][Object.keys(questions[gameQuestions[currentQuestionIndex]])[0]][0]
            };
            callback(sessionAttributes,
                buildSpeechletResponse(CARD_TITLE, speechOutput, repromptText, false));
        }

        // if currentQuestionIndex is 4, we've reached 5 questions (zero-indexed) and can exit the game session
        /*if (currentQuestionIndex == GAME_LENGTH - 1) {
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
        }*/
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

    var speechOutput = "I will ask you to tell me your symptoms, one at a time."
        + "For example, say sore throat, runny nose, congestion, cough, fever, headache, or muscle soreness. To start a new check at any time, say, start check. "
        + "To repeat the last question, say, repeat. "
        + "Would you like to keep going?",
        repromptText = "To give a list of symptoms, say one symptom at a time."
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
    return true;
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