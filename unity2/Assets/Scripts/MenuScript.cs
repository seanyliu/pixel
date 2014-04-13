using UnityEngine;
using System.Collections;

/// <summary>
/// Title screen script
/// </summary>
public class MenuScript : MonoBehaviour {

	private GUISkin skin;
	public GUIStyle btnStyle;

	// Debugging
	private string debugString;

	void Start() {
		// Load a skin for the buttons
		skin = Resources.Load("GUISkin") as GUISkin;
	}

	void OnGUI() {
		//const int buttonWidth = 600;
		//const int buttonHeight = 200;

		// Set the skin to use
		GUI.skin = skin;
		//GUI.backgroundColor = new Color(0,0,0,1); // get rid of border around button
		
		// Draw a button to start the game
		if (GUI.Button(
				// Center in X, 2/3 of the height in Y
				new Rect(
					Screen.width / 2 - ((Screen.width / 2) / 2),
					(2.0f * Screen.height / 3) - ((Screen.width / 2 * 49 / 190) / 2),
					Screen.width / 2,
					(Screen.width / 2 * 49 / 190)
					),
				"", // used to be string "Start"
				btnStyle
			)) {

			/*
				new Rect(
					Screen.width / 2 - (buttonWidth / 2),
					(2 * Screen.height / 3) - (buttonHeight / 2),
					buttonWidth,
					buttonHeight
					),
				btnStartTexture // used to be string "Start"
			*/

			// On Click, load the first level.
			// "Stage1" is the name of the first scene we created.
			Application.LoadLevel("Stage1");
		}

		// Process touches
		for (int t=0; t<Input.touches.Length; t++) {
			processATouchPerFingerCodeNumber (Input.touches[t], Input.touches[t].fingerId);
		}
	}

	void processATouchPerFingerCodeNumber(Touch t, int n) {
		if (t.phase == TouchPhase.Began) {
			debugPixel("A finger has ARRIVED.  it's arbitrary code number is: " + n);
			return;
		}
		if (t.phase == TouchPhase.Ended || t.phase == TouchPhase.Canceled) {
			debugPixel("Well that's it. A finger went away .. being arbitrary code number: " + n);
			debugPixel("(Don't get confused .. the code numbers will be resued, perhaps immediately.)");
			return;
    	}
	}

	void debugPixel(string s) {
		Debug.Log(s);
	}
}
