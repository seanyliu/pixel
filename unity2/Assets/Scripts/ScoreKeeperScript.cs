using UnityEngine;
using System.Collections;

public class ScoreKeeperScript : MonoBehaviour {

	private GUISkin skin;

	public static int Score;
	public Vector2 pos = new Vector2(20,75);
	public Vector2 size = new Vector2(650,60);

	void Start() {
		// Load a skin for the buttons
		skin = Resources.Load("GUISkin") as GUISkin;
	}

	void Awake() {
		Score = 0;
	}
	
	void OnGUI() {
		// Set the skin to use
		GUI.skin = skin;

		GUI.Label(new Rect(pos.x, pos.y, size.x, size.y), "Score: " + Score);
	}
}