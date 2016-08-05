'use strict';

/**
 * When editing your questions pay attention to your punctuation. Make sure you use question marks or periods.
 * Make sure the first answer is the correct one. Set at least 4 answers, any extras will be shuffled in.
 */
var questions = [
    {
        "Do new interactions or interactions with new people": [
            "excite and energize you",
            "worry or drain you"
        ]
    },
    {
        "Are you more": [
            "realistic",
            "idealistic"
        ]
    },
    {
        "Facts": [
             "have obvious meanings",
            "explain things or situations"
        ]
    },
    {
        "Do you prefer writers who": [
             "say what they mean",
            "use analogies, metaphors, and symbolism"
            ]
    },
    {
        "At parties, do you usually": [
             "stay late, with increasing energy",
            "leave early, with dereased energy"
        ]
    },
    {
        "If you must disappoint someone, are you usually ": [
           "honest and straightforward",
            "warm and caring"
        ]
    },
    {
        "Do you prefer to work to": [
          "deadlines",
            "whatever feels best"
        ]
    },
    {
        "Do you tend to be interested in the": [
            "actual",
            "possible"
        ]
    },
    {
        "Do you usually ": [
            "stay up to date on other people's lives",
            "get behind on other people's lives"
        ]
    },
    {
        "Is it easier to influence you with": [
            "convincing evidence",
            "a touching appeal"
        ]
    },
    {
        "Do you mostly choose ": [
             "rather carefully",
            "somewhat casually"
        ]
    },
    {
        "Which way is easier for you to understand people, using": [
            "reasoning",
            "instincts"
        ]
    },
    {
        "Do you consider yourself a better": [
             "conversationalist",
            "listener"
        ]
    },
    {
        "Which is of greater value to you": [
            "consistent thinking",
            "harmonious relationships"
        ]
    },
    {
        "You often approach or greet people": [
           "professionally or business-like",
           "personally and casually"
        ]
    },
    {
        "Are you more": [
            "sensible",
            "imaginative"
        ]
    },
    {
        "When standing in line, do you often": [
             "chat with others",
            "mind your own business"
        ]
    },
    {
        "Would you rather make decisions based on ": [
            "evidence and logic",
            "values or feeelings"
        ]
    },
     {
        "Are you regularly ": [
            "on time or early",
            "late"
        ]
    },
     {
        "Are visionaries and theorists": [
            "somewhat annoying",
            "rather fascinating"
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

var GAME_LENGTH = 20;
var ANSWER_COUNT = 2;
var CARD_TITLE = "Quiz";

function getWelcomeResponse(callback){
    var sessionAttributes = {},
    speechOutput = "Wikipedia defines The Myers–Briggs Type Indicator (MBTI) as an introspective self-report questionnaire designed to indicate psychological preferences in how people perceive the world and make decisions."
    + "I will ask you " + GAME_LENGTH.toString()
            + " questions, to determine your four letter Myers Brigg Personality Type. Let's begin. ",
            shouldEndSession = false,
            gameQuestions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
            correctAnswerIndex = 0, //roundAnswers deleted
            currentQuestionIndex = 0,
            roundAnswers = ["No", "Sometimes", "Regularly"],
            spokenQuestion = Object.keys(questions[gameQuestions[currentQuestionIndex]])[0],
            repromptText = "Question 1. " + spokenQuestion + " ",
            i, j;
            var answers = questions[gameQuestions[currentQuestionIndex]][Object.keys(questions[gameQuestions[currentQuestionIndex]])[0]];
            for (i = 0; i < ANSWER_COUNT; i++) {
                //repromptText += (i+1).toString() + ". " + Object.keys(questions[currentQuestionIndex])[i+1] + ". "
                repromptText += (i+1).toString() + ". " + answers[i] + ", ";
            }
            console.log(answers);
    speechOutput += repromptText;
    sessionAttributes = {
        "speechOutput": repromptText,
        "repromptText": repromptText,
        "currentQuestionIndex": currentQuestionIndex,
        "correctAnswerIndex": correctAnswerIndex,
        "questions": gameQuestions,
        "version": 0,
        "concrete": 0,
        "pathos": 0,
        "struct": 0,
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
            currentVersion = parseInt(session.attributes.version),
            currentConcrete = parseInt(session.attributes.concrete),
            currentPathos = parseInt(session.attributes.pathos),
            currentStruct = parseInt(session.attributes.struct),
            currentQuestionIndex = parseInt(session.attributes.currentQuestionIndex),
            correctAnswerText = session.attributes.correctAnswerText;

        speechOutputAnalysis = "";

        if (answerSlotValid && (currentQuestionIndex % 4 == 0) && (parseInt(intent.slots.Answer.value) == correctAnswerIndex+1)) {
            currentVersion--;
        }
        else if (answerSlotValid && (currentQuestionIndex % 4 == 0) && (parseInt(intent.slots.Answer.value) == correctAnswerIndex+2)) {
            currentVersion++;
        }
        else if (answerSlotValid && (currentQuestionIndex % 4 == 1) && (parseInt(intent.slots.Answer.value) == correctAnswerIndex+1)) {
            currentConcrete--;
        }
        else if (answerSlotValid && (currentQuestionIndex % 4 == 1) && (parseInt(intent.slots.Answer.value) == correctAnswerIndex+2)) {
            currentConcrete++;
        }
        else if (answerSlotValid && (currentQuestionIndex % 4 == 2) && (parseInt(intent.slots.Answer.value) == correctAnswerIndex+1)) {
            currentPathos--;
        }
        else if (answerSlotValid && (currentQuestionIndex % 4 == 2) && (parseInt(intent.slots.Answer.value) == correctAnswerIndex+2)) {
            currentPathos++;
        }
        else if (answerSlotValid && (currentQuestionIndex % 4 == 3) && (parseInt(intent.slots.Answer.value) == correctAnswerIndex+1)) {
            currentStruct--;
        }
        else if (answerSlotValid && (currentQuestionIndex % 4 == 3) && (parseInt(intent.slots.Answer.value) == correctAnswerIndex+2)) {
            currentStruct++;
        }

        // if currentQuestionIndex is 4, we've reached 5 questions (zero-indexed) and can exit the game session
        if (currentQuestionIndex == GAME_LENGTH - 1) {
            speechOutput = "";
            speechOutput += speechOutputAnalysis + "Your Myers-Briggs personality type is "
            if (currentVersion < 0)
            {
                speechOutput += "E"
            }
            if (currentVersion > 0)
            {
                speechOutput += "I"
            }
            if (currentConcrete < 0)
            {
                speechOutput += "S"
            }
            if (currentConcrete > 0)
            {
                speechOutput += "N"
            }
            if (currentPathos < 0)
            {
                speechOutput += "T"
            }
            if (currentPathos > 0)
            {
                speechOutput += "F"
            }
            if (currentStruct < 0)
            {
                speechOutput += "J"
            }
            if (currentStruct > 0)
            {
                speechOutput += "P"
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
                var answers = questions[gameQuestions[currentQuestionIndex]][Object.keys(questions[gameQuestions[currentQuestionIndex]])[0]];
            for (var i = 0; i < ANSWER_COUNT; i++) {
                repromptText += (i+1).toString() + ". " + answers[i] + ", "
            }
            //speechOutput += userGaveUp ? "" : "That answer is ";
            speechOutput += repromptText;

            sessionAttributes = {
                "speechOutput": repromptText,
                "repromptText": repromptText,
                "currentQuestionIndex": currentQuestionIndex,
                "correctAnswerIndex": correctAnswerIndex,
                "questions": gameQuestions,
                "version": currentVersion,
                "concrete": currentConcrete,
                "pathos": currentPathos,
                "struct": currentStruct,
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

    var speechOutput = "I will ask you " + GAME_LENGTH + " questions. Respond with the number of the answer that you agree more with. "
        + "For example, say one or two. To start a new test at any time, say, start test. "
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