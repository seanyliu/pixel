﻿using UnityEngine;
using System.Collections;

/// <summary>
/// Player controller and behavior
/// </summary>
public class PlayerScript : MonoBehaviour {

	// Speed of the player
	public Vector2 speed = new Vector2(50,50);

	// Store the movement
	private Vector2 velocity;

	// Jumping collision vars
	private bool grounded = true;
	public Transform groundCheck;
	public float groundRadius = 0.2f;
	public LayerMask whatIsGround;

	// Jumping vars
	public int maxJumps = 2;
	private int currentJumps = 0;
	public float jumpForce = 1000;

	// Jumping touch detection
	private bool jumpPressed = false;
	public float jumpMinCooldown = 0.01f;
	private float jumpCooldown;

	// Scoring variables
	public LayerMask allButPlayer;
	private int lastScoredEnemyInstanceID;

	private int counter;

	// Use this for initialization
	void Start () {
		jumpCooldown = 0f;
	}
	
	// Update is called once per frame
	void Update () {

		if (Input.GetKeyDown(KeyCode.UpArrow)) {
			counter++;
		}
		//Debug.Log (counter);

		// Retrieve axis information
		// We use the default axis that can be redefined in
		// "Edit" -> "Project Settings" -> "Input". This will
		// return a value between [-1, 1], 0 being the idle
		// state, 1 the right, -1 the left.
		// Equivalent to button pressing (which only give 0 or 1),
		// whereas an axis gives a whole float.
		/*
		 * DISABLE LEFT AND RIGHT MOVEMENT
		float inputX = Input.GetAxis ("Horizontal");
		float inputY = Input.GetAxis ("Vertical");

		// Movement per direction
		movement = new Vector2 (
			speed.x * inputX,
			speed.y * inputY
			);
        */

		/*
		 * DISABLE SHOOTING
		// Shooting
		bool shoot = Input.GetButtonDown("Fire1");
		shoot |= Input.GetButtonDown("Fire2");
		// Careful: For Mac users, ctrl + arrow is a bad idea
		
		if (shoot) {
			WeaponScript weapon = GetComponent<WeaponScript>();
			if (weapon != null)	{
				// false because the player is not an enemy
				weapon.Attack(false);

				// Sound!
				SoundEffectsHelper.Instance.MakePlayerShotSound();
			}
		}
		*/

		// Touch registers a TON of presses, so add a min cooldown
		if (jumpCooldown > 0) {
			jumpCooldown -= Time.deltaTime;
			jumpPressed = false;
		} else {
			//jumpPressed = Input.GetButtonDown("Fire1");
			//jumpPressed |= Input.GetButtonDown("Fire2");
			//jumpPressed = Input.GetAxis ("Vertical") > 0;
			jumpPressed = Input.GetKeyDown(KeyCode.UpArrow);
			jumpPressed |= (Input.touchCount > 0 && 
			                Input.GetTouch(0).phase == TouchPhase.Began);
			//jumpPressed |= Input.GetMouseButtonDown(0);
			jumpCooldown = jumpMinCooldown;
		}

		Debug.Log (jumpPressed);

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
		Debug.Log ("velocity2: "+rigidbody2D.velocity.y);
		// move the game object
		// This will tell the physic engine to move the game
		// object. We do that in FixedUpdate() as it is
		// recommended to do everything that is physics-related in there.

		// DISABLE LEFT AND RIGHT MOVEMENT
		// rigidbody2D.velocity = movement;

		grounded = Physics2D.OverlapCircle (groundCheck.position, groundRadius, whatIsGround);
		if (grounded) {
			currentJumps = 0; // allow double jumps
		}
		//Debug.Log(currentJumps);
		
		// JUMPING 
		if ((grounded || (currentJumps < maxJumps - 1)) && jumpPressed) {
			rigidbody2D.velocity = new Vector2(0, 0);
			rigidbody2D.AddForce(new Vector2(0, jumpForce));
			currentJumps++;
		}

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
		// Add the script to the parent because the current game
		// object is likely going to be destroyed immediately.
		transform.parent.gameObject.AddComponent<GameOverScript>();
	}
}
