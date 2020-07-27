# Sample Optra Skill

## How it works
Optra Skills use docker images to build and register module functions. An optra skill is limited to using azure's IoT SDKs. Once you have a docker image built, you will need to push it to a registry (public or private) and then manually add the skill in the skills interface in app.optraportal.com.

You can use the optra.config.json file to define your skill and register it to the optra portal (a CLI tool will be released soon for inline pushes).

## General publishing commands
```
docker build -t <YOUR REGISTRY>/<YOUR SKILL>:0.0.1 . --no-cache
docker push <YOUR REGISTRY>/<YOUR SKILL>:0.0.1
```
