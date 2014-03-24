using UnityEngine;
using System.Collections;

/// <summary>
/// Displays a health bar. Via:
/// http://answers.unity3d.com/questions/11892/how-would-you-make-an-energy-bar-loading-progress.html
/// </summary>

public class HealthBarScript : MonoBehaviour {

	public float barDisplay; //current progress
	public Vector2 pos = new Vector2(20,40);
	public Vector2 size = new Vector2(60,20);
	public Texture2D emptyTex;
	public Texture2D fullTex;
	private GUISkin skin;

	void OnGUI() {
		// Set the skin to use
		GUI.skin = skin;
		
		//draw the background:
		GUI.BeginGroup(new Rect(pos.x, pos.y, size.x, size.y));
		GUI.Box(new Rect(0,0, size.x, size.y), emptyTex);
		
		//draw the filled-in part:
		GUI.BeginGroup(new Rect(0,0, size.x * barDisplay, size.y));
		GUI.Box(new Rect(0,0, size.x, size.y), fullTex);
		GUI.EndGroup();
		GUI.EndGroup();
		
	} 

	// Use this for initialization
	void Start() {
		// Load a skin for the buttons
		skin = Resources.Load("GUISkin") as GUISkin;
	}
	
	// Update is called once per frame
	void Update () {
		//for this example, the bar display is linked to the current time,
		//however you would set this value based on your desired display
		//eg, the loading progress, the player's health, or whatever.
		barDisplay = (float)(GetComponent<HealthScript> ().hp) / (float)(GetComponent<HealthScript> ().maxHp);

		//   barDisplay = MyControlScript.staticHealth;
	}
}
