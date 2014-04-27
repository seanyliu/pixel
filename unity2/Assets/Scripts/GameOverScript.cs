using UnityEngine;
using System.Collections;

/// <summary>
/// Start or quit the game
/// </summary>
public class GameOverScript : MonoBehaviour {

	private GUISkin skin;
	public GUIStyle btnStyle;

	private Vector2 creditsPos = new Vector2(15 * Screen.width / 400, Screen.height - (70 * Screen.width / 400) );
	private Vector2 musicCreditsPos = new Vector2(15 * Screen.width / 400, Screen.height - (45 * Screen.width / 400) );
	private Vector2 creditsSize = new Vector2(2450,200);
	
	void Start() {
		// Load a skin for the buttons
		skin = Resources.Load("GUISkin") as GUISkin;
		skin.label.fontSize = 32 * Screen.width / 800;
		//skin.label.alignment = TextAnchor.UpperCenter;
	}

	void OnGUI() {
		const int buttonWidth = 600;
		const int buttonHeight = 200;

		// Set the skin to use
		GUI.skin = skin;
		
		if (GUI.Button(
				// Center in X, 1/2 of the height in Y
				new Rect(
					Screen.width / 2 - ((Screen.width / 2) / 2),
					(1 * Screen.height / 2) - ((Screen.width / 2 * 49 / 190) / 2),
					Screen.width / 2,
					(Screen.width / 2 * 49 / 190)
					),
				"",
				btnStyle
			)) {
			// Reload the level
			Application.LoadLevel("Stage1");
		}
		/*
		if (GUI.Button(
				// Center in X, 2/3 of the height in Y
				new Rect(
					Screen.width / 2 - (buttonWidth / 2),
					(2 * Screen.height / 3) - (buttonHeight / 2),
					buttonWidth,
					buttonHeight
				),
				"Back to menu"
				)) {
			// Reload the level
			Application.LoadLevel("Menu");
		}
		*/

		GUI.Label(new Rect(creditsPos.x, creditsPos.y, creditsSize.x, creditsSize.y), "Game by Sean Liu & Matt Wyble");
		GUI.Label(new Rect(musicCreditsPos.x, musicCreditsPos.y, creditsSize.x, creditsSize.y), "Music by Ove Melaa");
	}
}
