using UnityEngine;
using System.Collections;

/// <summary>
/// Player controller and behavior.
/// Note that we don't let the player move left or right, we only
/// let them jump! They are stationary and the background scrolls.
/// </summary>
public class PlayerScript : MonoBehaviour {
	
	// Jumping collision vars
	public Transform groundCheck;
	public float groundRadius = 0.2f;
	public LayerMask whatIsGround;
	private bool grounded = true;

	// Jump attributes
	public float jumpForce = 1000;

	// Double jump
	public int maxJumps = 2;
	private int currentJumps = 0;

	// Jumping touch detection
	private bool jumpPressed;
	//private float jumpCooldown;

	// A single touch registers a .Began and .Ended
	// a bajillion times. So we track the touchFingerId
	// to make sure that we only process the touch once.
	private int touchFingerId = -1;

	// Because there's a mismatch between update()
	// and FixedUpdate, sometimes FixedUpdate can be
	// called multiple times per touch in update().
	private int jumpId = -1;
	private int jumpIdProcessed = -1;

	// Scoring variables, used for detecting if
	// a dog runs under the user (+score in that case)
	public LayerMask allButPlayer;
	private int lastScoredEnemyInstanceID;

	private int counter;

	// Use this for initialization
	void Start () {
		//jumpCooldown = 0f;
		transform.parent.gameObject.GetComponent<GameOverScript> ().enabled = false;
	}
	
	// Update is called once per frame
	void Update () {

		/*
		 * public float jumpMinCooldown = 0.01f;
		// Touch registers a TON of presses, so add a min cooldown
		if (jumpCooldown > 0) {
			jumpCooldown -= Time.deltaTime;
			jumpPressed = false;
		} else {
			//jumpPressed = Input.GetButtonDown("Fire1");
			//jumpPressed |= Input.GetButtonDown("Fire2");
			//jumpPressed = Input.GetAxis ("Vertical") > 0;
			jumpPressed = Input.GetKeyDown(KeyCode.UpArrow);
			//jumpPressed |= (Input.touchCount > 0 && 
			//                Input.GetTouch(0).phase == TouchPhase.Ended);
			//jumpPressed |= Input.GetMouseButtonDown(0);
			jumpCooldown = jumpMinCooldown;
		}
		// See http://pixelnest.io/tutorials/unity-touch-controls/
		*/

		// If you put key detection in FixedUpdate, it appears sometimes it gets missed
		jumpPressed = PressedJump();

		// Make sure we are not outside the camera bounds
		var dist = (transform.position - Camera.main.transform.position).z;
		
		var leftBorder = Camera.main.ViewportToWorldPoint(
			new Vector3(0, 0, dist)
			).x;
		
		var rightBorder = Camera.main.ViewportToWorldPoint(
			new Vector3(1, 0, dist)
			).x;
		
		var topBorder = Camera.main.ViewportToWorldPoint(
			new Vector3(0, 0, dist)
			).y;
		
		var bottomBorder = Camera.main.ViewportToWorldPoint(
			new Vector3(0, 1, dist)
			).y;
		
		transform.position = new Vector3(
			Mathf.Clamp(transform.position.x, leftBorder, rightBorder),
			Mathf.Clamp(transform.position.y, topBorder, bottomBorder),
			transform.position.z
			);
	}

	// FixedUpdate called at every fixed framerate frame.
	// You should use this method over Update() when dealing
	// with physics ("RigidBody" and forces).
	void FixedUpdate() {

		// Detect if the user is on the ground
		grounded = Physics2D.OverlapCircle (groundCheck.position, groundRadius, whatIsGround);

		// Clear the number of jumps the user has made
		if (grounded) {
			currentJumps = 0;
			//Debug.Log ("clear grounded");
		}

		// TODO: BUG: Triple jumps are allowed? Why is it that currentJumps keeps staying at 0 instead of being incremented? It's allowing triple jumps to actually happen.

		/*
currentJumps: 0; maxJumps:2; grounded: True; jumpId: 4; jumpIdProcessed:2; True
UnityEngine.Debug:Log(Object)
PlayerScript:FixedUpdate() (at Assets/Scripts/PlayerScript.cs:118)

currentJumps: 0; maxJumps:2; grounded: False; jumpId: 5; jumpIdProcessed:4; True
UnityEngine.Debug:Log(Object)
PlayerScript:FixedUpdate() (at Assets/Scripts/PlayerScript.cs:118)

currentJumps: 1; maxJumps:2; grounded: False; jumpId: 7; jumpIdProcessed:5; True
UnityEngine.Debug:Log(Object)
PlayerScript:FixedUpdate() (at Assets/Scripts/PlayerScript.cs:118)

*/
		if (jumpPressed) {
			Debug.Log ("currentJumps: " + currentJumps + "; maxJumps:" + maxJumps + "; grounded: " +grounded + "; jumpId: "+jumpId+"; jumpIdProcessed:"+jumpIdProcessed+"; "+ (jumpPressed && ((currentJumps < maxJumps) || grounded) && jumpIdProcessed != jumpId));
		}
		// Jumping
		// Sometimes jumpPressed is off at this point... seems to fix it. But don't want to process a queue of jumps, so clear the queue.
		if (((currentJumps < maxJumps) || grounded) && jumpIdProcessed != jumpId) {
			Debug.Log ("JUMP!");
			Debug.Log ("currentJumps: " + currentJumps + "; maxJumps:" + maxJumps + "; grounded: " +grounded + "; jumpId: "+jumpId+"; jumpIdProcessed:"+jumpIdProcessed+"; "+ (jumpPressed && ((currentJumps < maxJumps) || grounded) && jumpIdProcessed != jumpId));
			rigidbody2D.velocity = new Vector2(0, 0);
			rigidbody2D.AddForce(new Vector2(0, jumpForce));
			currentJumps++;
			jumpIdProcessed = jumpId;
		} else if (currentJumps >= maxJumps) {
			jumpIdProcessed = jumpId;
		}

		// Scoring
		RaycastHit2D hit = Physics2D.Raycast (transform.position, -Vector2.up, Mathf.Infinity, allButPlayer);
		if (hit != null) {
			//Debug.Log(hit.collider.gameObject.name);
			int hitInstanceID = hit.collider.gameObject.GetInstanceID();
			if (hit.collider.gameObject.GetComponent<EnemyScript>() != null && hitInstanceID != lastScoredEnemyInstanceID) {
				ScoreKeeperScript.Score++;
				lastScoredEnemyInstanceID = hitInstanceID;
			}
		}

	}

	void OnCollisionEnter2D(Collision2D collision) {
		bool damagePlayer = false;
		
		// Collision with enemy
		EnemyScript enemy = collision.gameObject.GetComponent<EnemyScript>();
		if (enemy != null) {
			// Kill the enemy
			HealthScript enemyHealth = enemy.GetComponent<HealthScript>();
			if (enemyHealth != null) enemyHealth.Damage(enemyHealth.hp);
			
			damagePlayer = true;
		}
		
		// Damage the player
		if (damagePlayer) {
			HealthScript playerHealth = this.GetComponent<HealthScript>();
			if (playerHealth != null) playerHealth.Damage(1);
		}

	}

	void OnDestroy() {
		// Game Over.

		// Save the high score
		int highScore = PlayerPrefs.GetInt ("HighScore");
		if (ScoreKeeperScript.Score > highScore) {
			PlayerPrefs.SetInt ("HighScore", ScoreKeeperScript.Score);
		}

		// Add the script to the parent because the current game
		// object is likely going to be destroyed immediately.
		transform.parent.gameObject.GetComponent<GameOverScript> ().enabled = true;
	}
	

	/// <summary>
	/// Detect if a "Jump" key was pressed
	/// </summary>
	/// <returns><c>true</c>, if jump was pressed, <c>false</c> otherwise.</returns>
	bool PressedJump() {

		// First, detect for mobile devices
		if (Input.touchCount > 0) {
			Touch touch = Input.GetTouch (0);
			if (touch.phase == TouchPhase.Began) {
				if (touch.fingerId != touchFingerId) { // new touch
					jumpId++;
					touchFingerId = touch.fingerId;
					Debug.Log ("Touch begin: "+touchFingerId);
					return true;
				}
			} else if (touch.phase == TouchPhase.Ended) {
				Debug.Log ("Touch end: "+touchFingerId);
				touchFingerId = -1;
			}
		}

		else if (Input.GetKeyDown(KeyCode.UpArrow)) {
			Debug.Log ("Up key press");
			jumpId++;
			return true;
		}

		return false;
	}
}
