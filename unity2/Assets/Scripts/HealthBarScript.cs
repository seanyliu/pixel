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
	public Transform heartPrefab;
	public Camera mainCamera;
	private GUISkin skin;

	private Transform[] heartsArr;
	private int heartsShowing;

	void OnGUI() {
		/*
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
		*/
	} 

	// Use this for initialization
	void Start() {
		// Load a skin for the buttons
		skin = Resources.Load("GUISkin") as GUISkin;

		int numHeartsToCreate = GetComponent<HealthScript> ().maxHp;
		heartsArr = new Transform[numHeartsToCreate];
		heartsShowing = numHeartsToCreate;

		Vector3 p = mainCamera.ScreenToWorldPoint (new Vector3 (30 * Screen.width / 400, Screen.height-(70 * Screen.width / 400), mainCamera.nearClipPlane));

		for (int i = 0; i<numHeartsToCreate; i++) {
			Transform heart = Instantiate(heartPrefab) as Transform;
			heart.transform.parent = transform.parent;
			heart.transform.position = p + new Vector3(i, 0, 0);
			heart.transform.localScale = new Vector3(2, 2, 2);
			heartsArr[i] = heart;
		}
	}
	
	// Update is called once per frame
	void Update () {
		//for this example, the bar display is linked to the current time,
		//however you would set this value based on your desired display
		//eg, the loading progress, the player's health, or whatever.
		//barDisplay = (float)(GetComponent<HealthScript> ().hp) / (float)(GetComponent<HealthScript> ().maxHp);

		//   barDisplay = MyControlScript.staticHealth;
		if (GetComponent<HealthScript> ().hp < heartsShowing && heartsShowing > 0) {
			heartsArr[heartsShowing-1].transform.gameObject.SetActive(false);
			heartsShowing--;
		}

	}
}
