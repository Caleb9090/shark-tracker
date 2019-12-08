const Alexa = require('ask-sdk-core')
const skillbuilder = Alexa.SkillBuilders.custom()
const axios = require('axios')

function getRandomSharkId() {
    const allSharkIds = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 19, 20, 21, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 322, 41, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 328, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 138, 139, 302, 140, 141, 294, 142, 143, 145, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 170, 171, 172, 324, 325, 173, 175, 176, 179, 177, 178, 180, 181, 182, 314, 315, 183, 184, 300, 185, 327, 186, 187, 188, 321, 189, 190, 310, 309, 191, 192, 193, 312, 313, 194, 319, 320, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 241, 206, 207, 208, 209, 210, 211, 212, 305, 213, 214, 215, 216, 308, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 295, 232, 233, 234, 235, 236, 237, 238, 306, 239, 240, 329, 242, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 330, 255, 256, 258, 259, 260, 301, 261, 262, 323, 263, 264, 265, 266, 267, 316, 317, 268, 269, 270, 331, 299, 271, 273, 274, 275, 276, 277, 278, 279, 280, 281, 282, 283, 284, 311, 296, 297, 298, 285, 286, 304, 287, 288, 289, 290, 291, 292, 293, 303, 332, 326, 318, 335, 336, 337, 338, 339, 340, 341, 343, 344, 345, 346, 347, 348, 349, 350]
    const randomIdIndex = Math.floor(Math.random() * Math.floor(allSharkIds.length))

    return allSharkIds[randomIdIndex]
}

async function getRandomSharkData() {
    const randomShark = getRandomSharkId()
    const response = await axios.get(`http://dev.ocearch.org/tracker/ajax/filter-sharks/?sharks%5B%5D=${randomShark}`)
    const shark = response.data[0]

    return {
        species: shark.species,
        name: shark.name,
        pronoun: shark.gender === 'Male' ? 'He' : 'She',
        length: shark.length,
        weight: shark.weight,
        location: shark.tagLocation
    }
}

const FallBackIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.FallbackIntent'
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak('Im sorry I cant hear you over these sharks could you try that again?')
            .reprompt('Im sorry I cant hear you over these sharks could you try that again?')
            .withShouldEndSession(false)
            .getResponse()
    }
}

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent' ||
                handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent')
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak('See you later')
            .withShouldEndSession(true)
            .getResponse()
    }
}

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent'
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak('Shark tracker gives you tracking data on sharks for example you can say track a shark')
            .reprompt('These sharks arent going to track themselves')
            .withShouldEndSession(false)
            .getResponse()
    }
}

const NavigateHomeIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NavigateHomeIntent'
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak('Welcome to shark tracker if you would like to track a shark say track a shark')
            .reprompt('These sharks arent going to track themselves')
            .withShouldEndSession(false)
            .getResponse()
    }
}

// "RandomSharkIntent
const RandomSharkIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'RandomSharkIntent'
    },
    async  handle(handlerInput) {
        const shark = await getRandomSharkData()
        const sharkText = `Your shark is ${shark.name}. ${shark.pronoun} is a ${shark.length} ${shark.species} weighing ${shark.weight}. ${shark.pronoun} was tagged at ${shark.location}. `
        const repromptText = 'For another shark say track a shark'

        return handlerInput.responseBuilder
            .speak(sharkText + repromptText)
            .reprompt(repromptText)
            .withShouldEndSession(false)
            .getResponse()
    }
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest'
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak('Welcome to shark tracker if you would like to track a shark say track a shark')
            .reprompt('These sharks arent going to track themselves')
            .withShouldEndSession(false)
            .getResponse()
    }
}

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest'
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak('See you later')
            .withShouldEndSession(true)
            .getResponse()
    }
}

const ErrorHandler = {
    canHandle() {
        return true
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak('Im sorry I cant hear you over these sharks could you try that again?')
            .reprompt('Im sorry I cant hear you over these sharks could you try that again?')
            .withShouldEndSession(false)
            .getResponse()
    }
}

exports.handler = skillbuilder
    .addRequestHandlers(
        FallBackIntentHandler,
        CancelAndStopIntentHandler,
        HelpIntentHandler,
        LaunchRequestHandler,
        SessionEndedRequestHandler,
        NavigateHomeIntentHandler,
        RandomSharkIntentHandler
    )
    .addErrorHandlers(ErrorHandler)
    .lambda()