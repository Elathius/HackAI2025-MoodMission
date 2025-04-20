import { useLocalSearchParams } from 'expo-router';
import {useState, useEffect} from 'react'
import { Text, View } from '@/components/Themed';
import { StyleSheet } from 'react-native';
import InitialPrompt from '@/components/levelComponents/InitialPrompt';
import Quiz from '@/components/levelComponents/Quiz';
import InformationPage from '@/components/levelComponents/InformationPage';

const STATE = Object.freeze({
    INITIAL_PROMPT: 0,
    QUIZ: 1,
    EDUCATION: 2,
    GUIDED_ACTIVITY: 3,
    CONCLUSION: 4,
    FINAL_CHECK: 5,
    REWARD: 6,
    CONGRADULATIONS: 7,
  });


export default function level() {
    const { id } = useLocalSearchParams();
    const [stepNumber, setStepNumber] = useState(-1);
    const [response, setResponse] = useState<{ course: { steps: any[] } }>({
      course: {
        steps: [],
      }
    });
    const [step, setStep] = useState({});
    const [state, setState] = useState<number>(STATE.INITIAL_PROMPT);
    const [quiz, setQuiz] = useState<{question: string, options:any[], correct_answer: string, seconds_wait: number}>({
      question: "",
      options: [],
      correct_answer: "",
      seconds_wait: 0,
    });
    const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

    const [initialMood, setInitialMood] = useState<number | null>(null);
    
    const stepResponse = {
        stepNumber: 4
    }

    useEffect(() => {
        setStepNumber(stepResponse.stepNumber)
        fetchProblem()},[]
    )


    function fetchProblem() {
        setStepNumber(stepNumber-1);
        setStep({});
        const newProblem = {
            "course": {
              "title": "From Sadness to Happiness Journey",
              "emotion_transition": {
                "from": "sadness",
                "to": "happiness"
              },
              "initial_prompt": {
                "text": "How are you feeling right now on a scale of 1-10? (10 being happiest)",
                "seconds_wait": 5,
                "input_type": "number_scale",
                "input_range": {
                  "min": 1,
                  "max": 10
                }
              },
              "steps": [
                {
                  "step_number": 1,
                  "quiz": {
                    "question": "Which physical technique has been scientifically proven to rapidly reduce the stress hormone cortisol when you're feeling sad?",
                    "options": [
                      { "id": "A", "text": "Taking a cold shower" },
                      { "id": "B", "text": "Diaphragmatic breathing" },
                      { "id": "C", "text": "Running in place" },
                      { "id": "D", "text": "Listening to loud music" }
                    ],
                    "correct_answer": "B",
                    "seconds_wait": 10
                  },
                  "education": {
                    "correct_text": "Diaphragmatic breathing rapidly reduces cortisol levels in your body when you're feeling sad.",
                    "correct_text_seconds_wait": 5,
                    "explanation": "When you breathe deeply like this, you're activating your vagus nerve, which tells your brain \"I'm safe\" and signals your body to reduce stress hormones.",
                    "explanation_seconds_wait": 8
                  },
                  "guided_activity": {
                    "title": "Diaphragmatic Breathing Practice",
                    "instructions": {
                      "text": "Place one hand on your chest and one on your stomach. Now, let's breathe together:",
                      "wait": 5
                    },
                    "steps": [
                      {
                        "text": "Breathe in slowly through your nose for 4 counts...",
                        "countdown": 4,
                        "wait": 4
                      },
                      {
                        "text": "Hold your breath for 2 counts...",
                        "countdown": 2,
                        "wait": 2
                      },
                      {
                        "text": "Exhale slowly through your mouth for 6 counts...",
                        "countdown": 6,
                        "wait": 6
                      },
                      {
                        "text": "Let's do this two more times...",
                        "repeat": 2,
                        "wait": 3
                      }
                    ],
                    "conclusion": {
                      "text": "This is why you might already be feeling a bit calmer!",
                      "wait": 3
                    }
                  }
                },
                {
                  "step_number": 2,
                  "quiz": {
                    "question": "When you're feeling sad, which brain region becomes overactive, causing you to focus more on negative thoughts?",
                    "options": [
                      { "id": "A", "text": "Prefrontal cortex" },
                      { "id": "B", "text": "Hippocampus" },
                      { "id": "C", "text": "Amygdala" },
                      { "id": "D", "text": "Cerebellum" }
                    ],
                    "correct_answer": "C",
                    "seconds_wait": 10
                  },
                  "education": {
                    "correct_text": "The amygdala is your brain's emotional alarm system that becomes overactive when you're sad.",
                    "correct_text_seconds_wait": 5,
                    "explanation": "When your amygdala is calmer, your prefrontal cortex (thinking brain) can work better.",
                    "explanation_seconds_wait": 8
                  },
                  "guided_activity": {
                    "title": "Amygdala Calming Visualization",
                    "instructions": {
                      "text": "Close your eyes for a moment if you're comfortable doing so. Now, imagine your amygdala as a small, pulsing light that's currently glowing too brightly.",
                      "wait": 8
                    },
                    "steps": [
                      {
                        "text": "Visualize each breath you take slowly dimming that light...",
                        "wait": 3
                      },
                      {
                        "text": "Picture cool, calming air flowing in...",
                        "wait": 3
                      },
                      {
                        "text": "The light begins to soften...",
                        "wait": 3
                      },
                      {
                        "text": "Exhale any tension...",
                        "wait": 3
                      },
                      {
                        "text": "The light continues to dim to a gentle glow...",
                        "wait": 3
                      },
                      {
                        "text": "Your mind becomes quieter...",
                        "wait": 3
                      }
                    ],
                    "conclusion": {
                      "text": "Notice how you might feel slightly more clear-headed now than a moment ago.",
                      "wait": 5
                    }
                  }
                },
                {
                  "step_number": 3,
                  "quiz": {
                    "question": "Which activity has been shown to most effectively boost serotonin levels when you're feeling down?",
                    "options": [
                      { "id": "A", "text": "Scrolling through social media" },
                      { "id": "B", "text": "Watching TV" },
                      { "id": "C", "text": "Physical exercise" },
                      { "id": "D", "text": "Eating sugary foods" }
                    ],
                    "correct_answer": "C",
                    "seconds_wait": 10
                  },
                  "education": {
                    "correct_text": "Physical exercise naturally boosts your serotonin levels - the \"feel good\" neurotransmitter that helps regulate your mood.",
                    "correct_text_seconds_wait": 5,
                    "explanation": "When you're sad, your body naturally wants to be still, but movement is often exactly what helps shift your neurochemistry toward feeling better!",
                    "explanation_seconds_wait": 8
                  },
                  "guided_activity": {
                    "title": "Quick Movement Exercise",
                    "instructions": {
                      "text": "Stand up if you can, or sit up straight if you prefer:",
                      "wait": 5
                    },
                    "steps": [
                      {
                        "text": "Let's march in place for 20 seconds, lifting your knees high! Start now...",
                        "countdown": 20,
                        "wait": 20
                      },
                      {
                        "text": "Now roll your shoulders backward 5 times...",
                        "countdown": 5,
                        "wait": 10
                      },
                      {
                        "text": "Finally, stretch your arms up toward the ceiling, reaching as high as you can...",
                        "wait": 3
                      },
                      {
                        "text": "Hold for 3...",
                        "countdown": 3,
                        "wait": 3
                      },
                      {
                        "text": "And release with a big exhale!",
                        "wait": 3
                      }
                    ],
                    "conclusion": {
                      "text": "Notice how your body might feel slightly more energized now.",
                      "wait": 5
                    }
                  }
                },
                {
                  "step_number": 4,
                  "quiz": {
                    "question": "When transitioning from sadness to happiness, which technique helps rewire negative thought patterns by actively engaging the prefrontal cortex?",
                    "options": [
                      { "id": "A", "text": "Watching funny videos" },
                      { "id": "B", "text": "Gratitude practice" },
                      { "id": "C", "text": "Taking a nap" },
                      { "id": "D", "text": "Avoiding people" }
                    ],
                    "correct_answer": "B",
                    "seconds_wait": 10
                  },
                  "education": {
                    "correct_text": "Gratitude practice actively engages your prefrontal cortex, helping to rewire negative thought patterns associated with sadness.",
                    "correct_text_seconds_wait": 5,
                    "explanation": "When you practice gratitude, your brain actually releases dopamine and serotonin - the same neurotransmitters targeted by many antidepressant medications.",
                    "explanation_seconds_wait": 8
                  },
                  "guided_activity": {
                    "title": "Gratitude Exercise",
                    "instructions": {
                      "text": "Take a deep breath and think about these questions. I'll guide you through them:",
                      "wait": 5
                    },
                    "steps": [
                      {
                        "text": "What is one small thing you're grateful for today? It could be as simple as a comfortable chair or a warm drink...",
                        "wait": 5
                      },
                      {
                        "text": "Take 5 seconds to think of something specific...",
                        "countdown": 5,
                        "wait": 5
                      },
                      {
                        "text": "Now, really focus on this thing you're grateful for...",
                        "wait": 3
                      },
                      {
                        "text": "How does it make your life better?...",
                        "wait": 5
                      },
                      {
                        "text": "Notice any subtle shift in how your body feels as you focus on appreciation...",
                        "wait": 5
                      },
                      {
                        "text": "Let's take another deep breath together...",
                        "wait": 2
                      },
                      {
                        "text": "In for 1... 2... 3... 4...",
                        "countdown": 4,
                        "wait": 4
                      },
                      {
                        "text": "And out for 1... 2... 3... 4...",
                        "countdown": 4,
                        "wait": 4
                      }
                    ],
                    "conclusion": {
                      "text": "That's why you might notice a subtle mood lift even after this brief exercise!",
                      "wait": 5
                    }
                  }
                },
                {
                  "step_number": 5,
                  "quiz": {
                    "question": "What physiological change occurs in your body when you transition from feeling sad to feeling happy?",
                    "options": [
                      { "id": "A", "text": "Blood pressure significantly increases" },
                      { "id": "B", "text": "Breathing becomes more shallow" },
                      { "id": "C", "text": "Muscle tension decreases" },
                      { "id": "D", "text": "Digestion slows down" }
                    ],
                    "correct_answer": "C",
                    "seconds_wait": 10
                  },
                  "education": {
                    "correct_text": "When you transition from sadness to happiness, the muscles throughout your body naturally release tension.",
                    "correct_text_seconds_wait": 5,
                    "explanation": "Your body and emotions are deeply connected - as your muscles relax, it actually sends signals back to your brain that you're safe and can feel happier!",
                    "explanation_seconds_wait": 8
                  },
                  "guided_activity": {
                    "title": "Tension-Release Exercise",
                    "instructions": {
                      "text": "Let's do a tension-release exercise together:",
                      "wait": 5
                    },
                    "steps": [
                      {
                        "text": "Let's start by deliberately tensing your shoulders - pull them up toward your ears...",
                        "wait": 3
                      },
                      {
                        "text": "Hold it... feel the tension...",
                        "countdown": 3,
                        "wait": 3
                      },
                      {
                        "text": "Now completely release and drop your shoulders down...",
                        "wait": 3
                      },
                      {
                        "text": "Notice how different that feels... the relief of letting go...",
                        "wait": 5
                      },
                      {
                        "text": "Next, gently tense your facial muscles - scrunch up your face tight...",
                        "wait": 3
                      },
                      {
                        "text": "Hold for 3... 2... 1...",
                        "countdown": 3,
                        "wait": 3
                      },
                      {
                        "text": "And release completely, letting your face relax...",
                        "wait": 3
                      },
                      {
                        "text": "Feel how your face softens...",
                        "wait": 3
                      },
                      {
                        "text": "Take a deep breath in...",
                        "wait": 2
                      },
                      {
                        "text": "And as you exhale, imagine releasing any remaining tension from your entire body...",
                        "wait": 4
                      },
                      {
                        "text": "Like water flowing out...",
                        "wait": 3
                      }
                    ],
                    "conclusion": {
                      "text": "This muscle relaxation you're experiencing reflects a shift in your nervous system from \"fight-or-flight\" to \"rest-and-digest\" mode.",
                      "wait": 5
                    }
                  }
                }
              ],
              "final_check": {
                "text": "How are you feeling now compared to when we started? Has your mood improved on a scale of 1-10?",
                "seconds_wait": 8,
                "input_type": "number_scale",
                "input_range": {
                  "min": 1,
                  "max": 10
                },
                "reward_threshold": 5
              },
              "reward": {
                "medal_type": "red",
                "title": "Red Medal of Emotional Understanding",
                "description": "This medal represents the real neurological and physiological changes you've created through these practices. The combination of understanding *why* these techniques work and actually *experiencing* them is powerful for emotional regulation.",
                "seconds_wait": 10,
                "techniques_summary": [
                  "Diaphragmatic breathing (4-2-6 pattern)",
                  "Amygdala calming visualization",
                  "Quick physical movement",
                  "Focused gratitude practice",
                  "Progressive muscle relaxation"
                ],
                "congratulations_text": "Each time you practice these skills, you strengthen the neural pathways that support happiness and emotional resilience!"
              }
            },
            "metadata": {
              "version": "1.0",
              "created_date": "2025-04-20",
              "target_emotions": ["sadness", "happiness"],
              "estimated_completion_time_minutes": 15,
              "difficulty_level": "beginner"
            }
          }
          setResponse(newProblem);
          setStepNumber(newProblem.course.steps.length);
    }

    let returnInitialCondition = (selectedValue: number) => {
      setInitialMood(selectedValue);
      setState(STATE.QUIZ);
      fetchQuiz();
    }
    let fetchQuiz = () => {
      setQuiz(response.course.steps[response.course.steps.length-stepNumber].quiz);
    }
    let returnQuiz = (index: number) => {
      let chosenAnswer = quiz.options[index].id;
      setIsAnswerCorrect(chosenAnswer === quiz.correct_answer);
      setState(STATE.EDUCATION);
    }
  return (
    <View style={styles.container}>
        <View style={styles.header}><Text style={{ fontSize: 24}}>Level: {id}</Text></View>
        
        {state === STATE.INITIAL_PROMPT &&
        <InitialPrompt setSelected={returnInitialCondition}/>}
        
        {state === STATE.QUIZ && quiz.question &&
        <Quiz question={quiz.question} answerChoices={quiz.options} returnFunction={returnQuiz}/>}

        {state === STATE.EDUCATION && 
        (isAnswerCorrect === true ? 
        <InformationPage title={`Correct! The Answer is ${quiz.correct_answer}`} description={response.course.steps[response.course.steps.length-stepNumber].education.correct_text}/> : 
        <InformationPage title={`Incorrect :(   The Answer is ${quiz.correct_answer}`} description={response.course.steps[response.course.steps.length-stepNumber].education.correct_text}/>)}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      marginInline: 'auto',
      alignItems: 'center',
      width: '100%',
      height: '100%',
    },
    header: {
        marginInline: 'auto',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 1,
        paddingInline: 10,
        width: '100%',
        height: '8%',
    },
    gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      padding: 16,
    },
    gridItem: {
      width: '48%', // roughly half width with space-between
      aspectRatio: 3/8, // square
      backgroundColor: '#6200EE',
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
     },
    text: {
      color: 'white',
      fontSize: 24,
      fontWeight: 'bold',
    },
  });

