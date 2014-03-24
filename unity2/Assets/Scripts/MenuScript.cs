using UnityEngine;
using System.Collections;

/// <summary>
/// Title screen script
/// </summary>
public class MenuScript : MonoBehaviour {

	private GUISkin skin;

	void Start() {
		// Load a skin for the buttons
		skin = Resources.Load("GUISkin") as GUISkin;
	}

	void OnGUI() {
		const int buttonWidth = 300;
		const int buttonHeight = 100;

		// Set the skin to use
		GUI.skin = skin;
		
		// Draw a button to start the game
		if (GUI.Button(
				// Center in X, 2/3 of the height in Y
				new Rect(
					Screen.width / 2 - (buttonWidth / 2),
					(2 * Screen.height / 3) - (buttonHeight / 2),
					buttonWidth,
					buttonHeight
					),
				"Start!"
			)) {
			// On Click, load the first level.
			// "Stage1" is the name of the first scene we created.
			Application.LoadLevel("Stage1");
		}
	}
}
