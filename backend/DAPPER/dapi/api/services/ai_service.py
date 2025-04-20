import json
import os
from datetime import datetime
from django.conf import settings
from openai import OpenAI

def generate_journey_with_claude(emotion, target_emotion, context):
    """Generate a complete journey using Claude via OpenRouter API"""
    
    prompt = f"""
    Create a 5-step educational journey to help someone transition from feeling {emotion} to {target_emotion}.
    
    Their context: "{context}"
    
    For each step, include:
    1. A quiz question with 4 multiple-choice options (labeled A, B, C, D)
    2. The correct answer with educational explanation
    3. A guided interactive activity
    
    Make sure to use the following JSON structure, especially for timing controls:
    
    {{
      "course": {{
        "title": "From {emotion.title()} to {target_emotion.title()} Journey",
        "emotion_transition": {{
          "from": "{emotion}",
          "to": "{target_emotion}"
        }},
        "initial_prompt": {{
          "text": "How are you feeling right now on a scale of 1-10?",
          "seconds_wait": 5,
          "input_type": "number_scale",
          "input_range": {{
            "min": 1,
            "max": 10
          }}
        }},
        "steps": [
          {{
            "step_number": 1,
            "quiz": {{
              "question": "...",
              "options": [
                {{"id": "A", "text": "..."}},
                {{"id": "B", "text": "..."}},
                {{"id": "C", "text": "..."}},
                {{"id": "D", "text": "..."}}
              ],
              "correct_answer": "B",
              "seconds_wait": 10
            }},
            "education": {{
              "correct_text": "...",
              "correct_text_seconds_wait": 5,
              "explanation": "...",
              "explanation_seconds_wait": 8
            }},
            "guided_activity": {{
              "title": "...",
              "instructions": {{
                "text": "...",
                "wait": 5
              }},
              "steps": [
                {{
                  "text": "...",
                  "countdown": 4,
                  "wait": 4
                }},
                // More steps...
              ],
              "conclusion": {{
                "text": "...",
                "wait": 3
              }}
            }}
          }},
          // Steps 2-5...
        ],
        "final_check": {{
          "text": "How are you feeling now?",
          "seconds_wait": 8,
          "input_type": "number_scale",
          "input_range": {{
            "min": 1,
            "max": 10
          }},
          "reward_threshold": 5
        }},
        "reward": {{
          "medal_type": "color",
          "title": "Medal of Achievement",
          "description": "...",
          "seconds_wait": 10,
          "techniques_summary": [
            // Techniques learned
          ],
          "congratulations_text": "..."
        }}
      }},
      "metadata": {{
        "version": "1.0",
        "created_date": "{datetime.now().strftime('%Y-%m-%d')}",
        "target_emotions": ["{emotion}", "{target_emotion}"],
        "estimated_completion_time_minutes": 15,
        "difficulty_level": "beginner"
      }}
    }}
    """
    
    try:
        # Check if OpenRouter API key is available
        if settings.OPENROUTER_API_KEY:
            # Initialize OpenAI client with OpenRouter base URL and API key
            client = OpenAI(
                base_url="https://openrouter.ai/api/v1",
                api_key=settings.OPENROUTER_API_KEY,
                default_headers={
                    "HTTP-Referer": settings.OPENROUTER_REFERRER  # Optional
                }
            )
            
            # Call OpenRouter API with Claude model
            response = client.chat.completions.create(
                model="anthropic/claude-3-opus-20240229",  # OpenRouter model identifier for Claude
                messages=[
                    {"role": "system", "content": "You are an expert in psychology and emotional well-being. Create detailed, educational emotional journeys in JSON format."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=4000,
                response_format={"type": "text"}  # Ensure we get text back, not JSON object
            )
            
            # Extract content from response
            content = response.choices[0].message.content
            
            # Extract JSON from response if needed
            if "```json" in content:
                json_str = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                json_str = content.split("```")[1].split("```")[0].strip()
            else:
                json_str = content.strip()
            
            # Parse and validate the JSON
            try:
                journey_data = json.loads(json_str)
                return journey_data
            except json.JSONDecodeError:
                # Fallback to template if AI response is not valid JSON
                print("Error parsing JSON from OpenRouter response")
                return get_journey_template(emotion, target_emotion)
        else:
            # No API key, use fallback template
            print("No OpenRouter API key found, using fallback template")
            return get_journey_template(emotion, target_emotion)
            
    except Exception as e:
        # Fallback to template if API call fails
        print(f"Error calling OpenRouter API: {str(e)}")
        return get_journey_template(emotion, target_emotion)

def get_journey_template(emotion, target_emotion):
    """Return a pre-built template for the given emotions"""
    
    # Emotion mapping
    emotion_medals = {
        "sad": "blue",
        "angry": "orange", 
        "anxious": "purple",
        "envy": "green",
        "happy": "gold"
    }
    
    medal_color = emotion_medals.get(emotion, "silver")
    
    # Basic template structure
    template = {
        "course": {
            "title": f"From {emotion.title()} to {target_emotion.title()} Journey",
            "emotion_transition": {
                "from": emotion,
                "to": target_emotion
            },
            "initial_prompt": {
                "text": f"How are you feeling right now on a scale of 1-10? (10 being most {target_emotion})",
                "seconds_wait": 5,
                "input_type": "number_scale",
                "input_range": {
                    "min": 1,
                    "max": 10
                }
            },
            # Steps would be pre-defined per emotion pair
            "steps": get_steps_for_emotion(emotion, target_emotion),
            "final_check": {
                "text": f"How are you feeling now compared to when we started? Has your {emotion} decreased on a scale of 1-10?",
                "seconds_wait": 8,
                "input_type": "number_scale",
                "input_range": {
                    "min": 1,
                    "max": 10
                },
                "reward_threshold": 5
            },
            "reward": {
                "medal_type": medal_color,
                "title": f"{medal_color.title()} Medal of {target_emotion.title()}",
                "description": "This medal represents the neurological and physiological changes you've created through these practices.",
                "seconds_wait": 10,
                "techniques_summary": [
                    "Emotional awareness",
                    "Cognitive reframing",
                    "Mindfulness practice",
                    "Self-compassion",
                    "Behavioral activation"
                ],
                "congratulations_text": f"Each time you practice these skills, you strengthen the neural pathways that support {target_emotion}!"
            }
        },
        "metadata": {
            "version": "1.0",
            "created_date": datetime.now().strftime('%Y-%m-%d'),
            "target_emotions": [emotion, target_emotion],
            "estimated_completion_time_minutes": 15,
            "difficulty_level": "beginner"
        }
    }
    
    return template

def get_steps_for_emotion(emotion, target_emotion):
    """Return pre-defined steps for the given emotion pair"""
    # This would contain pre-defined steps for common emotion pairs
    # For brevity, I'm including just a sample for sadness->happiness
    
    if emotion == "sad" and target_emotion == "happy":
        return [
            {
                "step_number": 1,
                "quiz": {
                    "question": "Which of these is NOT a common physiological effect of sadness?",
                    "options": [
                        {"id": "A", "text": "Decreased energy levels"},
                        {"id": "B", "text": "Increased heart rate"},
                        {"id": "C", "text": "Changes in appetite"},
                        {"id": "D", "text": "Disrupted sleep patterns"}
                    ],
                    "correct_answer": "B",
                    "seconds_wait": 10
                },
                "education": {
                    "correct_text": "Correct! Sadness typically decreases heart rate, unlike anxiety or excitement.",
                    "correct_text_seconds_wait": 5,
                    "explanation": "Sadness typically slows our physiological systems down. It decreases heart rate, can cause fatigue, and often leads to withdrawal behaviors. This is different from anxiety or fear, which activate our sympathetic nervous system and increase heart rate.",
                    "explanation_seconds_wait": 8
                },
                "guided_activity": {
                    "title": "Body Awareness Scan",
                    "instructions": {
                        "text": "Let's do a quick body scan to notice how sadness feels in your body right now.",
                        "wait": 5
                    },
                    "steps": [
                        {
                            "text": "Close your eyes and take a deep breath", 
                            "countdown": 4, 
                            "wait": 4
                        },
                        {
                            "text": "Notice any sensations in your chest", 
                            "countdown": 4, 
                            "wait": 4
                        },
                        {
                            "text": "Notice any sensations in your shoulders and neck", 
                            "countdown": 4, 
                            "wait": 4
                        },
                        {
                            "text": "Notice any sensations in your face", 
                            "countdown": 4, 
                            "wait": 4
                        }
                    ],
                    "conclusion": {
                        "text": "By noticing these physical sensations, you've taken the first step toward managing your emotions.",
                        "wait": 3
                    }
                }
            },
            {
                "step_number": 2,
                "quiz": {
                    "question": "Which cognitive distortion often accompanies sadness?",
                    "options": [
                        {"id": "A", "text": "Catastrophizing"},
                        {"id": "B", "text": "Mind reading"},
                        {"id": "C", "text": "Overgeneralization"},
                        {"id": "D", "text": "All of the above"}
                    ],
                    "correct_answer": "D",
                    "seconds_wait": 10
                },
                "education": {
                    "correct_text": "Correct! All of these cognitive distortions can accompany sadness.",
                    "correct_text_seconds_wait": 5,
                    "explanation": "Sadness often brings cognitive distortions that reinforce negative feelings. Catastrophizing makes us imagine the worst outcomes. Mind reading assumes others think negatively of us. Overgeneralization takes one negative event and applies it broadly to life. Recognizing these patterns is the first step to challenging them.",
                    "explanation_seconds_wait": 8
                },
                "guided_activity": {
                    "title": "Thought Challenge",
                    "instructions": {
                        "text": "Let's identify and challenge a negative thought you're having.",
                        "wait": 5
                    },
                    "steps": [
                        {
                            "text": "Identify a negative thought you've had today", 
                            "countdown": 5, 
                            "wait": 5
                        },
                        {
                            "text": "What evidence supports this thought?", 
                            "countdown": 5, 
                            "wait": 5
                        },
                        {
                            "text": "What evidence contradicts this thought?", 
                            "countdown": 5, 
                            "wait": 5
                        },
                        {
                            "text": "What would you tell a friend with this thought?", 
                            "countdown": 5, 
                            "wait": 5
                        }
                    ],
                    "conclusion": {
                        "text": "By examining your thoughts objectively, you can reduce their emotional impact.",
                        "wait": 3
                    }
                }
            },
            {
                "step_number": 3,
                "quiz": {
                    "question": "Which activity is most likely to boost mood according to research?",
                    "options": [
                        {"id": "A", "text": "Scrolling social media"},
                        {"id": "B", "text": "Watching TV alone"},
                        {"id": "C", "text": "Light physical exercise"},
                        {"id": "D", "text": "Online shopping"}
                    ],
                    "correct_answer": "C",
                    "seconds_wait": 10
                },
                "education": {
                    "correct_text": "Correct! Light physical exercise has been consistently shown to improve mood.",
                    "correct_text_seconds_wait": 5,
                    "explanation": "Exercise releases endorphins, natural mood elevators. Even light activity like walking can reduce sadness and anxiety. Physical movement also disrupts rumination cycles by shifting focus to the body. Regular exercise has been shown in studies to be as effective as medication for mild to moderate depression in some cases.",
                    "explanation_seconds_wait": 8
                },
                "guided_activity": {
                    "title": "Mood-Boosting Movement",
                    "instructions": {
                        "text": "Let's do a brief movement exercise to activate your body's natural mood enhancers.",
                        "wait": 5
                    },
                    "steps": [
                        {
                            "text": "Stand up and gently stretch your arms overhead", 
                            "countdown": 5, 
                            "wait": 5
                        },
                        {
                            "text": "Roll your shoulders backward 5 times", 
                            "countdown": 5, 
                            "wait": 5
                        },
                        {
                            "text": "March in place, lifting your knees high", 
                            "countdown": 10, 
                            "wait": 10
                        },
                        {
                            "text": "Take 3 deep breaths, feeling the energy in your body", 
                            "countdown": 5, 
                            "wait": 5
                        }
                    ],
                    "conclusion": {
                        "text": "Even this brief activity can begin to shift your neurochemistry toward a more positive state.",
                        "wait": 3
                    }
                }
            },
            {
                "step_number": 4,
                "quiz": {
                    "question": "Which of these is a healthy way to process sadness?",
                    "options": [
                        {"id": "A", "text": "Suppressing the emotion entirely"},
                        {"id": "B", "text": "Distracting yourself until it passes"},
                        {"id": "C", "text": "Expressing the emotion through creative outlets"},
                        {"id": "D", "text": "Analyzing why you shouldn't feel sad"}
                    ],
                    "correct_answer": "C",
                    "seconds_wait": 10
                },
                "education": {
                    "correct_text": "Correct! Expressing emotions through creative outlets is a healthy processing method.",
                    "correct_text_seconds_wait": 5,
                    "explanation": "Creative expression gives form to emotions that can be difficult to verbalize. Activities like journaling, art, music, or dance allow us to process sadness without judgment. This approach acknowledges the emotion while providing a constructive channel for its energy. Research shows creative expression can reduce stress hormones and increase positive emotions.",
                    "explanation_seconds_wait": 8
                },
                "guided_activity": {
                    "title": "Expressive Writing",
                    "instructions": {
                        "text": "Let's try a brief expressive writing exercise to process your feelings.",
                        "wait": 5
                    },
                    "steps": [
                        {
                            "text": "Take a moment to connect with how you're feeling", 
                            "countdown": 5, 
                            "wait": 5
                        },
                        {
                            "text": "Write or mentally compose a letter to your emotion", 
                            "countdown": 15, 
                            "wait": 15
                        },
                        {
                            "text": "What would you like to say to this feeling?", 
                            "countdown": 10, 
                            "wait": 10
                        },
                        {
                            "text": "How might this emotion be trying to help you?", 
                            "countdown": 10, 
                            "wait": 10
                        }
                    ],
                    "conclusion": {
                        "text": "By acknowledging and expressing your emotions, you reduce their power to overwhelm you.",
                        "wait": 3
                    }
                }
            },
            {
                "step_number": 5,
                "quiz": {
                    "question": "Which practice has been shown to increase positive emotions over time?",
                    "options": [
                        {"id": "A", "text": "Gratitude practice"},
                        {"id": "B", "text": "Comparing yourself to others"},
                        {"id": "C", "text": "Setting extremely high standards"},
                        {"id": "D", "text": "Focusing on future goals"}
                    ],
                    "correct_answer": "A",
                    "seconds_wait": 10
                },
                "education": {
                    "correct_text": "Correct! Gratitude practice has been consistently shown to increase positive emotions.",
                    "correct_text_seconds_wait": 5,
                    "explanation": "Gratitude practice trains the brain to notice positive aspects of life that we often overlook. Regular gratitude exercises have been shown to increase happiness, reduce depression, improve sleep, and even strengthen immune function. This practice works by shifting attention from what's lacking to what's present, creating new neural pathways that support positive emotional states.",
                    "explanation_seconds_wait": 8
                },
                "guided_activity": {
                    "title": "Gratitude Practice",
                    "instructions": {
                        "text": "Let's practice gratitude to build positive emotional resources.",
                        "wait": 5
                    },
                    "steps": [
                        {
                            "text": "Think of something small you're grateful for today", 
                            "countdown": 5, 
                            "wait": 5
                        },
                        {
                            "text": "Recall a person who has supported you recently", 
                            "countdown": 5, 
                            "wait": 5
                        },
                        {
                            "text": "Notice something about your body you're thankful for", 
                            "countdown": 5, 
                            "wait": 5
                        },
                        {
                            "text": "Identify a challenge that taught you something valuable", 
                            "countdown": 5, 
                            "wait": 5
                        }
                    ],
                    "conclusion": {
                        "text": "Regular gratitude practice can gradually shift your emotional baseline toward greater happiness.",
                        "wait": 3
                    }
                }
            }
        ]
    elif emotion == "anxious" and target_emotion == "calm":
        return [
            {
                "step_number": 1,
                "quiz": {
                    "question": "Which physical symptom is commonly associated with anxiety?",
                    "options": [
                        {"id": "A", "text": "Decreased heart rate"},
                        {"id": "B", "text": "Muscle relaxation"},
                        {"id": "C", "text": "Shallow breathing"},
                        {"id": "D", "text": "Decreased blood pressure"}
                    ],
                    "correct_answer": "C",
                    "seconds_wait": 10
                },
                "education": {
                    "correct_text": "Correct! Shallow breathing is a common physical symptom of anxiety.",
                    "correct_text_seconds_wait": 5,
                    "explanation": "Anxiety activates our sympathetic nervous system (fight-or-flight response), which often leads to shallow, rapid breathing. This breathing pattern can actually increase feelings of anxiety by reducing carbon dioxide levels in the blood, causing lightheadedness and increased heart rate. Understanding this connection gives us a powerful intervention point: controlling our breath.",
                    "explanation_seconds_wait": 8
                },
                "guided_activity": {
                    "title": "Diaphragmatic Breathing",
                    "instructions": {
                        "text": "Let's practice deep breathing to activate your parasympathetic nervous system.",
                        "wait": 5
                    },
                    "steps": [
                        {
                            "text": "Place one hand on your chest and one on your stomach", 
                            "countdown": 3, 
                            "wait": 3
                        },
                        {
                            "text": "Breathe in slowly through your nose for 4 counts", 
                            "countdown": 4, 
                            "wait": 4
                        },
                        {
                            "text": "Hold your breath for 2 counts", 
                            "countdown": 2, 
                            "wait": 2
                        },
                        {
                            "text": "Exhale slowly through your mouth for 6 counts", 
                            "countdown": 6, 
                            "wait": 6
                        },
                        {
                            "text": "Repeat this cycle 3 more times", 
                            "countdown": 36, 
                            "wait": 36
                        }
                    ],
                    "conclusion": {
                        "text": "This breathing pattern activates your parasympathetic nervous system, which counteracts anxiety's effects.",
                        "wait": 3
                    }
                }
            },
            # Additional steps would be added here for anxious->calm
        ]
    elif emotion == "angry" and target_emotion == "peaceful":
        return [
            {
                "step_number": 1,
                "quiz": {
                    "question": "What happens in the brain when we experience anger?",
                    "options": [
                        {"id": "A", "text": "The prefrontal cortex becomes more active"},
                        {"id": "B", "text": "The amygdala becomes less active"},
                        {"id": "C", "text": "The amygdala triggers the fight-or-flight response"},
                        {"id": "D", "text": "Serotonin levels increase significantly"}
                    ],
                    "correct_answer": "C",
                    "seconds_wait": 10
                },
                "education": {
                    "correct_text": "Correct! The amygdala triggers the fight-or-flight response during anger.",
                    "correct_text_seconds_wait": 5,
                    "explanation": "When we feel angry, the amygdala (our brain's alarm system) activates the fight-or-flight response, flooding our body with stress hormones like adrenaline and cortisol. This physiological response prepares us for conflict by increasing heart rate, blood pressure, and muscle tension. At the same time, activity in the prefrontal cortex (responsible for rational thinking) often decreases, making it harder to think clearly.",
                    "explanation_seconds_wait": 8
                },
                "guided_activity": {
                    "title": "Temperature Change",
                    "instructions": {
                        "text": "Let's try a physical technique to cool down anger quickly.",
                        "wait": 5
                    },
                    "steps": [
                        {
                            "text": "If possible, place your hands or face under cool water", 
                            "countdown": 5, 
                            "wait": 5
                        },
                        {
                            "text": "Alternatively, place a cool object against your forehead or neck", 
                            "countdown": 5, 
                            "wait": 5
                        },
                        {
                            "text": "Focus on the cooling sensation as it spreads", 
                            "countdown": 10, 
                            "wait": 10
                        },
                        {
                            "text": "Take slow, deep breaths as you continue to focus on the sensation", 
                            "countdown": 10, 
                            "wait": 10
                        }
                    ],
                    "conclusion": {
                        "text": "This technique works by activating the mammalian diving reflex, which naturally calms your nervous system.",
                        "wait": 3
                    }
                }
            },
            # Additional steps would be added here for angry->peaceful
        ]
    else:
        # Default generic steps
        return [
            {
                "step_number": 1,
                "quiz": {
                    "question": f"Which of these is a healthy way to respond to feeling {emotion}?",
                    "options": [
                        {"id": "A", "text": "Ignore the feeling completely"},
                        {"id": "B", "text": "Acknowledge the emotion without judgment"},
                        {"id": "C", "text": "Distract yourself with social media"},
                        {"id": "D", "text": "Tell yourself to just feel better"}
                    ],
                    "correct_answer": "B",
                    "seconds_wait": 10
                },
                "education": {
                    "correct_text": "Correct! Acknowledging emotions without judgment is a key part of emotional intelligence.",
                    "correct_text_seconds_wait": 5,
                    "explanation": f"When we feel {emotion}, acknowledging the emotion without judgment allows us to process it in a healthy way. This is a fundamental principle of mindfulness and emotional intelligence.",
                    "explanation_seconds_wait": 8
                },
                "guided_activity": {
                    "title": "Mindful Awareness",
                    "instructions": {
                        "text": f"Let's practice acknowledging your {emotion} with mindfulness.",
                        "wait": 5
                    },
                    "steps": [
                        {
                            "text": "Take a deep breath in and out", 
                            "countdown": 4, 
                            "wait": 4
                        },
                        {
                            "text": f"Say to yourself: 'I notice I'm feeling {emotion}'", 
                            "countdown": 4, 
                            "wait": 4
                        },
                        {
                            "text": "Observe any physical sensations without trying to change them", 
                            "countdown": 4, 
                            "wait": 4
                        }
                    ],
                    "conclusion": {
                        "text": "By acknowledging your emotions, you've taken an important step toward emotional well-being.",
                        "wait": 3
                    }
                }
            },
            {
                "step_number": 2,
                "quiz": {
                    "question": "Which of these statements about emotions is true?",
                    "options": [
                        {"id": "A", "text": "Emotions are either good or bad"},
                        {"id": "B", "text": "We should always try to control our emotions"},
                        {"id": "C", "text": "Emotions provide valuable information about our needs"},
                        {"id": "D", "text": "Emotional reactions are always rational"}
                    ],
                    "correct_answer": "C",
                    "seconds_wait": 10
                },
                "education": {
                    "correct_text": "Correct! Emotions provide valuable information about our needs and values.",
                    "correct_text_seconds_wait": 5,
                    "explanation": "Emotions serve as messengers that help us understand what matters to us. Rather than being 'good' or 'bad,' emotions are signals that can guide our decisions and actions. Understanding the message behind an emotion helps us respond effectively to situations.",
                    "explanation_seconds_wait": 8
                },
                "guided_activity": {
                    "title": "Emotion as Messenger",
                    "instructions": {
                        "text": "Let's explore what your current emotion might be telling you.",
                        "wait": 5
                    },
                    "steps": [
                        {
                            "text": "What need might this emotion be highlighting?", 
                            "countdown": 5, 
                            "wait": 5
                        },
                        {
                            "text": "What value or boundary might this emotion be protecting?", 
                            "countdown": 5, 
                            "wait": 5
                        },
                        {
                            "text": "What action might this emotion be suggesting?", 
                            "countdown": 5, 
                            "wait": 5
                        }
                    ],
                    "conclusion": {
                        "text": "By listening to your emotions, you gain valuable insights that can guide your choices.",
                        "wait": 3
                    }
                }
            },
            {
                "step_number": 3,
                "quiz": {
                    "question": "Which technique can help regulate intense emotions?",
                    "options": [
                        {"id": "A", "text": "Suppressing the emotion"},
                        {"id": "B", "text": "Physical exercise"},
                        {"id": "C", "text": "Ruminating on the cause"},
                        {"id": "D", "text": "Consuming caffeine or sugar"}
                    ],
                    "correct_answer": "B",
                    "seconds_wait": 10
                },
                "education": {
                    "correct_text": "Correct! Physical exercise is an effective way to regulate intense emotions.",
                    "correct_text_seconds_wait": 5,
                    "explanation": "Exercise helps process emotions by metabolizing stress hormones, releasing endorphins, and shifting focus to physical sensations. Even brief movement can change your physiological state and create distance from overwhelming feelings.",
                    "explanation_seconds_wait": 8
                },
                "guided_activity": {
                    "title": "Movement Reset",
                    "instructions": {
                        "text": "Let's use physical movement to shift your emotional state.",
                        "wait": 5
                    },
                    "steps": [
                        {
                            "text": "Stand up if possible and shake out your hands and arms", 
                            "countdown": 5, 
                            "wait": 5
                        },
                        {
                            "text": "Roll your shoulders forward and backward", 
                            "countdown": 5, 
                            "wait": 5
                        },
                        {
                            "text": "Gently twist your torso from side to side", 
                            "countdown": 5, 
                            "wait": 5
                        },
                        {
                            "text": "Take three deep breaths with arms raising on inhale, lowering on exhale", 
                            "countdown": 10, 
                            "wait": 10
                        }
                    ],
                    "conclusion": {
                        "text": "This brief movement break helps reset your nervous system and create emotional space.",
                        "wait": 3
                    }
                }
            },
            {
                "step_number": 4,
                "quiz": {
                    "question": "Which statement about thoughts and emotions is most accurate?",
                    "options": [
                        {"id": "A", "text": "Our thoughts directly cause our emotions"},
                        {"id": "B", "text": "We have no control over our thoughts"},
                        {"id": "C", "text": "Thoughts and emotions influence each other"},
                        {"id": "D", "text": "Emotions have no effect on thinking"}
                    ],
                    "correct_answer": "C",
                    "seconds_wait": 10
                },
                "education": {
                    "correct_text": "Correct! Thoughts and emotions have a bidirectional relationship, influencing each other.",
                    "correct_text_seconds_wait": 5,
                    "explanation": "Our thoughts can trigger or intensify emotions, while our emotions can shape the content and style of our thinking. This relationship creates feedback loops that can either escalate or de-escalate our emotional experiences. By recognizing this connection, we can intervene at either the thought or emotion level to create positive change.",
                    "explanation_seconds_wait": 8
                },
                "guided_activity": {
                    "title": "Thought Reframing",
                    "instructions": {
                        "text": "Let's practice reframing a thought to shift your emotional experience.",
                        "wait": 5
                    },
                    "steps": [
                        {
                            "text": "Notice a thought that's contributing to your current emotion", 
                            "countdown": 5, 
                            "wait": 5
                        },
                        {
                            "text": "Ask yourself: Is this thought helpful? Is it accurate?", 
                            "countdown": 5, 
                            "wait": 5
                        },
                        {
                            "text": "Consider a more balanced or helpful perspective", 
                            "countdown": 5, 
                            "wait": 5
                        },
                        {
                            "text": "Notice how this new perspective feels in your body", 
                            "countdown": 5, 
                            "wait": 5
                        }
                    ],
                    "conclusion": {
                        "text": "By reframing unhelpful thoughts, you can shift your emotional experience.",
                        "wait": 3
                    }
                }
            },
            {
                "step_number": 5,
                "quiz": {
                    "question": "Which of these practices builds emotional resilience over time?",
                    "options": [
                        {"id": "A", "text": "Avoiding all emotional triggers"},
                        {"id": "B", "text": "Regular self-care and stress management"},
                        {"id": "C", "text": "Keeping emotions private from others"},
                        {"id": "D", "text": "Focusing only on positive emotions"}
                    ],
                    "correct_answer": "B",
                    "seconds_wait": 10
                },
                "education": {
                    "correct_text": "Correct! Regular self-care and stress management build emotional resilience.",
                    "correct_text_seconds_wait": 5,
                    "explanation": "Emotional resilience is built through consistent practices that support overall well-being. Regular self-care activities like adequate sleep, nutrition, exercise, and stress management create a foundation that helps us navigate emotional challenges. Rather than avoiding emotions, resilience comes from developing the skills to process them effectively.",
                    "explanation_seconds_wait": 8
                },
                "guided_activity": {
                    "title": "Resilience Planning",
                    "instructions": {
                        "text": "Let's create a simple resilience plan for ongoing emotional well-being.",
                        "wait": 5
                    },
                    "steps": [
                        {
                            "text": "Identify one self-care activity you can practice daily", 
                            "countdown": 5, 
                            "wait": 5
                        },
                        {
                            "text": "Think of a person you can reach out to when you need support", 
                            "countdown": 5, 
                            "wait": 5
                        },
                        {
                            "text": "Consider a calming activity you can use when feeling overwhelmed", 
                            "countdown": 5, 
                            "wait": 5
                        },
                        {
                            "text": "Imagine implementing this plan and notice how it feels", 
                            "countdown": 5, 
                            "wait": 5
                        }
                    ],
                    "conclusion": {
                        "text": "Having a simple resilience plan helps you navigate emotional challenges more effectively.",
                        "wait": 3
                    }
                }
            }
        ]
