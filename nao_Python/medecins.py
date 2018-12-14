#!/usr/bin/env python
# -*- coding: utf-8 -*-

import time
from naoqi import ALProxy
import urllib2
import json

ROBOT_IP = "169.254.232.52"

# header pour les requetes à l'API
hdr = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.11 '
                  '(KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.3',
    'Accept-Encoding': 'none',
    'Accept-Language': 'en-US,en;q=0.8',
    'Connection': 'keep-alive'}

# definitions des modules
asr = ALProxy("ALSpeechRecognition", ROBOT_IP, 9559)
memProxy = ALProxy("ALMemory", ROBOT_IP, 9559)
tts = ALProxy("ALTextToSpeech", ROBOT_IP, 9559)
tts.setLanguage("French")
tts.say("dites le nom du medecin?")
# Mise en pause de ASR pour definition des propriètés
asr.pause(True)
# definition de la langue
asr.setLanguage("French")
# recuperation de la liste des nom des patients
req = urllib2.Request('http://localhost:3000/api/medecin', headers=hdr)
response = urllib2.urlopen(req)
html = response.read()
data = json.loads(html)
out = []
print data
for element in data:
    out.append(str(element["medname"]))
print out

# definition de la liste de mots
asr.setVocabulary(out, True)
asr.pause(False)

# Start the speech recognition engine with user Test_ASR
asr.subscribe("Test_ASR")
memProxy.subscribeToEvent('WordRecognized', ROBOT_IP, 'wordRecognized')
print 'Speech recognition engine started'
time.sleep(5)
asr.unsubscribe("Test_ASR")
data = memProxy.getData("WordRecognized")
print data
name = data[0]
name = name.replace("<...>", "").replace(" ", "")
data[0] = name

# recuperation de la salle
req = urllib2.Request('http://localhost:3000/api/medecin/search/' + name, headers=hdr)
response = urllib2.urlopen(req)
html = response.read()
salle = json.loads(html)
print salle[0]["salle"]
tts.say(str(data[0]) + " est dans la salle " + str(salle[0]["salle"]))
