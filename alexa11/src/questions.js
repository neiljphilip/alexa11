'use strict';

/**
 * When editing your questions pay attention to your punctuation. Make sure you use question marks or periods.
 * Make sure the first answer is the correct one. Set at least 4 answers, any extras will be shuffled in.
 */
var questions = [
    {
        "Do you feel anxious or nervous when you are around your partner?": [
            "No",
            "Sometimes",
            "Regularly"
        ]
    },
    {
        "Do you watch what you are doing in order to avoid making your partner angry or upset?": [
            "No",
            "Sometimes",
            "Regularly"
        ]
    },
    {
        "Do you feel obligated or coerced into having sex with your partner? ": [
             "No",
            "Sometimes",
            "Regularly"
        ]
    },
    {
        "Are you afraid of voicing a different opinion than your partner? ": [
             "No",
            "Sometimes",
            "Regularly"
            ]
    },
    {
        "Does your partner criticize you or embarrass you in front of others? ": [
             "No",
            "Sometimes",
            "Regularly"
        ]
    },
    {
        "Does your partner check up on what you have been doing, and not believe your answers? ": [
           "No",
            "Sometimes",
            "Regularly"
        ]
    },
    {
        "Is your partner jealous, such as accusng you of having affairs? ": [
          "No",
            "Sometimes",
            "Regularly"
        ]
    },
    {
        "Does your partner tell you that he or she will stop beating you when you start behaving yourself? ": [
            "No",
            "Sometimes",
            "Regularly"
        ]
    },
    {
        "Have you stopped seeing your friends or family because of your partner's behavior? ": [
            "No",
            "Sometimes",
            "Yes"
        ]
    },
    {
        "Does your partner's behavior make you feel as if you are wrong?": [
            "No",
            "Sometimes",
            "Regularly"
        ]
    },
    {
        "Does your partner threaten to harm you? ": [
             "No",
            "Sometimes",
            "Regularly"
        ]
    },
    {
        "Do you try to please your partner rather than yourself in order to avoid being hurt? ": [
            "No",
            "Sometimes",
            "Regularly"
        ]
    },
    {
        "Does your partner keep you from going out or doing things that you want to do?": [
             "No",
            "Sometimes",
            "Regularly"
        ]
    },
    {
        "Do you feel that nothing you do is ever good enough for your partner? ": [
            "No",
            "Sometimes",
            "Regularly"
        ]
    },
    {
        "Does your partner say that if you try to leave him or her, you will never see your children again? ": [
           "No",
           "Sometimes",
            "Regularly"
        ]
    },
    {
        "Does your partner say that if you try to leave, he or she will kill himself or herself or you? ": [
            "No",
            "Sometimes",
            "Regularly"
        ]
    },
    {
        "Do you have to make up excuses for your partner's behavior? ": [
             "No",
            "Sometimes",
            "Regularly"
        ]
    },
    {
        "Do you lie to your family, friends and doctor about your bruises, cuts and scratches? ": [
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
var CARD_TITLE = "First Assessment";

function getWelcomeResponse(callback){
    var sessionAttributes = {},
    speechOutput = "Wikipedia defines domestic violence as a pattern of behavior which involves violence or other abuse by one person against another in a domestic setting. I will ask you " + GAME_LENGTH.toString()
            + " questions, please answer these questions honestly to get an accurate assessment of the health of your relationship. Let's begin. ",
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
                    speechOutput += "Although you may be facing problems in your relationship, they are probably not the result of domestic abuse.";
                }
                else if (currentScore > 7) {
                    speechOutput += "Domestic abuse could be an issue in your relationship. Seek further help.";
                }
                else {
                    speechOutput += "Domestic abuse appears to be a serious problem in your relationship. Please seek professional help.";
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
