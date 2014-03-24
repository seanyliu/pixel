using UnityEngine;
using System.Collections;

/// <summary>
/// Player controller and behavior
/// </summary>
public class PlayerScript : MonoBehaviour {

	// Speed of the player
	public Vector2 speed = new Vector2(50,50);

	// Store the movement
	private Vector2 movement;

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {

		// Retrieve axis information
		// We use the default axis that can be redefined in
		// "Edit" -> "Project Settings" -> "Input". This will
		// return a value between [-1, 1], 0 being the idle
		// state, 1 the right, -1 the left.
		// Equivalent to button pressing (which only give 0 or 1),
		// whereas an axis gives a whole float.
		float inputX = Input.GetAxis ("Horizontal");
		float inputY = Input.GetAxis ("Vertical");

		// Movement per direction
		movement = new Vector2 (
			speed.x * inputX,
			speed.y * inputY
			);

		// Shooting
		bool shoot = Input.GetButtonDown("Fire1");
		shoot |= Input.GetButtonDown("Fire2");
		// Careful: For Mac users, ctrl + arrow is a bad idea
		
		if (shoot) {
			WeaponScript weapon = GetComponent<WeaponScript>();
			if (weapon != null)	{
				// false because the player is not an enemy
				weapon.Attack(false);
			}
		}

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
		// move the game object
		// This will tell the physic engine to move the game
		// object. We do that in FixedUpdate() as it is
		// recommended to do everything that is physics-related in there.
		rigidbody2D.velocity = movement;
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
}
