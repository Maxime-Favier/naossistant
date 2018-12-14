#!/usr/bin/env python
# -*- coding: utf-8 -*-
import time
from naoqi import ALProxy
import urllib2
import json

ROBOT_IP = "169.254.232.52"

# header pour les requetes à l'API

# definitions des modules
asr = ALProxy("ALSpeechRecognition", ROBOT_IP, 9559)
memProxy = ALProxy("ALMemory", ROBOT_IP, 9559)
tts = ALProxy("ALTextToSpeech", ROBOT_IP, 9559)
tts.setLanguage("French")

# Mise en pause de ASR pour definition des propriètés
asr.pause(True)
# definition de la langue
asr.setLanguage("English")
# definition de la liste de mots
asr.removeAllContext()
asr.setVocabulary(["joke", "chocolate"], False)
asr.pause(False)

# Start the speech recognition engine with user Test_ASR
asr.subscribe("Test_ASR")
memProxy.subscribeToEvent('WordRecognized', ROBOT_IP, 'wordRecognized')
print 'Speech recognition engine started'
time.sleep(3)
asr.unsubscribe("Test_ASR")
data = memProxy.getData("WordRecognized")
print data

if (data[0] == "joke" or data[0] == "chocolate"):
    # recuperation de la salle

    req = urllib2.Request('https://www.chucknorrisfacts.fr/api/get?data=tri:alea;nb:1')
    req.encoding = 'ISO-8859-1'
    response = urllib2.urlopen(req)
    html = response.read()
    html.decode('UTF-8')
    data = json.loads(html)
    print data
    j = str(data[0]["fact"])
    j.decode("UTF-8")
    tts.say(j)
elif data[0] == "chocolate":
    tts.say("i love chocolate")
