import * as THREE from "three";
import * as PIXI from "pixi.js";
import TETSUO from "@SolidSolutionsDev/tetsuo";

/**
 * Enum of all the events the text screen can fire
 */
const EventTypes = {
  /**
   * When a new text line has been added to the screen
   */
  newTextAnimation: "newTextAnimation",

  /**
   * When a new character has been typed in the text animation
   */
  newCharacter: "newCharacter",

  /**
   * When the animation of a new text line is over
   */
  textAnimationOver: "textAnimationOver",

  /**
   * When a new question is added to the screen
   */
  newQuestion: "newQuestion",

  /**
   * When an answer from the list is selected
   */
  answerSelected: "answerSelected",

  /**
   * When the answer that's currently selected is confirmed (end of question)
   */
  answerConfirmed: "answerConfirmed",
};

export class TextScreen {
  constructor(options = {}) {
    // set default values
    this._elapsedTime = 0;
    this._subscribers = [];
    this._entries = [];
    this._width = options.width;
    this._height = options.height;
    this._backgroundColor = options.backgroundColor || 0x002c2c;
    this._marginTop = options.marginTop || 90;
    this._marginLeft = options.marginLeft || 240;
    this._paddingBottom = options.paddingBottom || 50;
    this._paddingLeft = options.paddingLeft || 50;
    this._spaceBetweenEntries = options.spaceBetweenEntries || 20;
    this._defaultTextStyle = {
      fontFamily: "Courier New",
      fontSize: 22,
      fontWeight: "bold",
      wordWrap: true,
      wordWrapWidth: this._width - 2 * this._marginLeft - 2 * this._paddingLeft,
      fill: 0x3cdc7c,
      ...options.defaultTextStyle,
    };
  }

  /**
   * Generates a background graphic
   */
  _generateBackground() {
    this._background = new PIXI.Graphics();

    let backgroundWidth = this._width - 2 * this._marginLeft;
    let backgroundHeight = this._height - 2 * this._marginTop;

    this._background.beginFill(this._backgroundColor);
    this._background.drawRect(0, 0, backgroundWidth, backgroundHeight);
    this._background.endFill();

    this._background.pivot.set(backgroundWidth / 2, backgroundHeight / 2);
    this._background.position.set(this._width / 2, this._height / 2);
  }

  /**
   * Generates the foreground container that will hold the text
   */
  _generateForeground() {
    this._foreground = new PIXI.Container();
    this._foreground.position.x = this._marginLeft + this._paddingLeft;
    this._foreground.position.y = this._marginTop + this._paddingBottom;

    // this graphic needs to be added to give width & height to the foreground container
    let g = new PIXI.Graphics();
    g.beginFill(0xff0000);
    g.drawRect(
      0,
      0,
      this._width - 2 * this._marginLeft - 2 * this._paddingLeft,
      this._height - 2 * this._marginTop - 2 * this._paddingBottom
    );
    g.endFill();
    g.alpha = 0;
    this._foreground.addChild(g);
  }

  /**
   * Adds an entry to the foreground, moving previous entries up and removing any entry that is out of bounds
   *
   * @param newEntry
   * @param height
   */
  _addEntry(newEntry, height) {
    if (!this._foreground) return;

    height = height || newEntry.height;

    // place new entry at the bottom of the foreground
    newEntry.position.y = this._foreground.height - height;

    for (let i = this._entries.length - 1; i >= 0; i--) {
      let entry = this._entries[i];

      // move other entries up
      entry.position.y -= height + this._spaceBetweenEntries;

      // if entry is out of bounds, remove it from the foreground
      // TODO fade entries out
      if (entry.position.y < 0) {
        this._entries.splice(i, 1);
        this._foreground && this._foreground.removeChild(entry);
      }
    }

    this._entries.push(newEntry);
    this._foreground.addChild(newEntry);

    return newEntry;
  }

  /**
   * Deletes all entries
   */
  clear() {
    for (let i = this._entries.length - 1; i >= 0; i--) {
      let entry = this._entries[i];
      this._entries.splice(i, 1);
      this._foreground && this._foreground.removeChild(entry);
    }
  }

  /**
   * Adds a new text line animation to the screen
   *
   * @param textContent - Text of the line
   * @param textStyle - Style of the text font
   * @param options - Extra animation options
   * @param callback - Callback when animation finishes
   */
  addText(textContent, textStyle, options = {}, callback) {
    let block = "█";

    let text = new PIXI.Text(textContent, {
      ...this._defaultTextStyle,
      ...textStyle,
    });
    let height = text.height;

    text.text = block;

    this._addEntry(text, height);

    let elapsedTime = 0;
    let framesPerChar = options.framesPerChar || 60;

    this._trigger(EventTypes.newTextAnimation, {
      textContent,
      textStyle,
      options,
    });

    // check if theres a previous animation running and finish it
    if (this._currentAnimation) {
      this._currentAnimation(0, true);
      this._currentAnimation = undefined;
    }

    let animation = (timeDelta, forceEnd) => {
      // animation is forcefully ended
      if (forceEnd) {
        // display all text and callback
        text.text = textContent;
        setTimeout(() => callback && callback(), 0);
        return true;
      }

      elapsedTime += timeDelta;
      let elapsedChars = Math.floor(elapsedTime / framesPerChar);

      // if animation isn't over
      if (elapsedChars < textContent.length) {
        // if a new character was added to the screen
        if (text.text !== textContent.slice(0, elapsedChars) + block) {
          text.text = textContent.slice(0, elapsedChars) + block;
          this._trigger(EventTypes.newCharacter, {
            character: text.text[elapsedChars - 1],
          });
        }
        return false;
      }
      // if animation is over
      else {
        text.text = textContent;
        this._trigger(EventTypes.newCharacter, {
          character: text.text[text.text.length - 1],
        });
        setTimeout(() => callback && callback(), 0);
        this._trigger(EventTypes.textAnimationOver, {});
        return true;
      }
    };

    this._currentAnimation = animation;

    return animation;
  }

  /**
   * Adds a question animation to the screen
   *
   * @param questionText - Text of the question line
   * @param answers - List of answers to be presented
   * @param options - Extra animation options
   */
  addQuestion(questionText, answers, options) {
    this._trigger(EventTypes.newQuestion, {
      questionText,
      answers,
      options,
    });

    // first ask the question
    this.addText(
      questionText,
      { ...this._defaultTextStyle, ...options.questionStyle },
      undefined,

      // when it finishes animating display the answers
      () => {
        let selected = answers[0].id;

        let question = {
          selected,
          container: new PIXI.Container(),
          answers: [],
        };

        for (let i = 0; i < answers.length; i++) {
          let answerContainer = new PIXI.Container();

          let spaceBetweenAnswers =
            options.spaceBetweenAnswers || this._spaceBetweenEntries;

          let answerText = new PIXI.Text(answers[i].textContent, {
            ...this._defaultTextStyle,
            ...answers[i].textStyle,
          });
          answerText.position.set(40, 10);
          answerContainer.addChild(answerText);

          let answerSelector = new PIXI.Graphics();
          answerSelector.beginFill(
            (answers[i].textStyle && answers[i].textStyle.fill) ||
            options.questionStyle.fill ||
            this._defaultTextStyle.fill
          );
          answerSelector.drawRect(0, 0, 10, 10);
          answerSelector.endFill();
          answerSelector.position.set(10, 5 + answerText.height / 2);
          answerSelector.visible = i == 0;
          answerContainer.addChild(answerSelector);

          question.answers.push({
            id: answers[i].id,
            container: answerContainer,
            selector: answerSelector,
          });

          if (i > 0) {
            // position answer according to previous answer position
            answerContainer.position.y =
              spaceBetweenAnswers +
              question.answers[i - 1].container.position.y +
              question.answers[i - 1].container.height;
          }

          question.container.addChild(answerContainer);
        }

        this._currentQuestion = question;

        this._addEntry(question.container);
      }
    );
  }

  /**
   * Selects an answer from the list of the current question's answers
   *
   * @param answerId
   */
  selectAnswer(answerId) {
    if (this._currentQuestion) {
      this._currentQuestion.answers.forEach(
        (answer) => (answer.selector.visible = answerId === answer.id)
      );

      this._currentQuestion.selected = answerId;

      this._trigger(EventTypes.answerSelected, { answerId });
    }
  }

  /**
   * Confirms the currently selected answer
   */
  confirmAnswer() {
    this._trigger(EventTypes.answerConfirmed, {
      answerId: this._currentQuestion.selected,
    });
    this._currentQuestion = undefined;
  }

  /**
   * Builds the screen
   */
  prepare() {
    return new Promise((resolve, reject) => {
      let pixi = new TETSUO.PIXINode("pixi", {
        width: this._width,
        height: this._height,
      });

      this._generateBackground();
      this._background && pixi.add(this._background);

      this._generateForeground();
      this._foreground && pixi.add(this._foreground);

      let crt = new TETSUO.ShaderNode("crt", {
        fragmentShader: TETSUO.Shaders.compile(
          TETSUO.Shaders.math,
          TETSUO.Shaders.filters,

          /* glsl */ `
                        varying vec2 vUv;
                        uniform sampler2D inputTex;
                        uniform float iTime;
                        uniform vec2 texSize;

                        float gradient(vec2 p) {
                            return 1. - length(p / 3.);
                        }

                        float scanline(vec2 p) {
                            float s = 1. - abs(sin(iTime * 2. + p.y * 3.));
                            return s > 0.7 ? s : 0.;
                        }

                        float smallline(vec2 p) {
                            return abs(sin(iTime * 5. - p.y * 450.) * 0.9);
                        }

                        void main() {
                            vec2 p = curve(vUv);

                            vec4 t = bloom(inputTex, texSize, p, .6, 0.3, 1.);  
                            gl_FragColor = vec4(1.);
                            gl_FragColor = mix(t, (t  + scanline(p) * 0.02 - smallline(p) * 0.02) * gradient((p - 0.5) * 2.), t.a);
                        }
                    `
        ),
      })
        .addInput(pixi, "inputTex")
        .addInput(
          new TETSUO.UniformNode("texSize", {
            value: new THREE.Vector2(this._width, this._height),
            gui: { hide: true },
          })
        );

      this.update(0);

      this._outputNode = crt;

      resolve(this._outputNode);
    });
  }

  /**
   * Updates the screen
   *
   * @param time - Current animation time
   * @param updateOptions - Update options to override defaults
   */
  update(deltaTime, updateOptions) {
    if (!this._currentAnimation || this._currentAnimation(deltaTime)) {
      this._currentAnimation = undefined;
    }

    this._elapsedTime += deltaTime;
  }

  /**
   * Subscribes to text screen events
   *
   * @param subscriber
   */
  subscribe(subscriber) {
    this._subscribers.push(subscriber);
  }

  getNode() {
    return this._outputNode;
  }

  /**
   * Triggers a text screen event
   *
   * @param eventType
   * @param eventData
   */
  _trigger(eventType, eventData) {
    this._subscribers.forEach((subscriber) => subscriber(eventType, eventData));
  }
}
