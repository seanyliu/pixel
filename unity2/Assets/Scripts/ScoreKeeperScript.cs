using UnityEngine;
using System.Collections;

public class ScoreKeeperScript : MonoBehaviour {

	private GUISkin skin;

	public static int Score;
	private Vector2 pos = new Vector2(15 * Screen.width / 400, 10 * Screen.width / 400);
	private Vector2 size = new Vector2(1250,650);
	private int highScore = 0;

	void Start() {
		// Load a skin for the buttons
		skin = Resources.Load("GUISkin") as GUISkin;
		skin.label.fontSize = 48 * Screen.width / 800;
		highScore = PlayerPrefs.GetInt ("HighScore");
	}

	void Awake() {
		Score = 0;
	}
	
	void OnGUI() {
		// Set the skin to use
		GUI.skin = skin;

		if (Score > highScore) {
			highScore = Score;
		}

		GUI.Label(new Rect(pos.x, pos.y, size.x, size.y), "Score: " + Score + "  Highest: " + highScore);
	}
}