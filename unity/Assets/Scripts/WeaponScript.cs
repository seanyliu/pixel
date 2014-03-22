using UnityEngine;
using System.Collections;

/// <summary>
/// Launch projectile
/// </summary>
public class WeaponScript : MonoBehaviour {

	/// <summary>
	/// Projectile prefab for shooting
	/// </summary>
	public Transform shotPrefab;

	/// <summary>
	/// Cooldown between shots
	/// </summary>
	public float shootingRate = 0.25f;

	//--------------------------------
	// 2 - Cooldown
	//--------------------------------
	private float shootCooldown;
	
	void Start() {
		shootCooldown = 0f;
	}

	// Update is called once per frame
	void Update() {
		if (shootCooldown > 0) {
			shootCooldown -= Time.deltaTime;
		}
	}
	
	//--------------------------------
	// 3 - Shooting from another script
	//--------------------------------
	
	/// <summary>
	/// Create a new projectile if possible
	/// </summary>
	public void Attack(bool isEnemy) {
		if (CanAttack) {
			shootCooldown = shootingRate;
			
			// Create a new shot
			var shotTransform = Instantiate(shotPrefab) as Transform;
			
			// Assign position
			shotTransform.position = transform.position;
			
			// Designate if this is enemy property
			ShotScript shot = shotTransform.gameObject.GetComponent<ShotScript>();
			if (shot != null) {
				shot.isEnemyShot = isEnemy;
			}
			
			// Make the weapon shoot always towards it
			MoveScript move = shotTransform.gameObject.GetComponent<MoveScript>();
			if (move != null) {
				move.direction = this.transform.right; // towards in 2D space is the right of the sprite
			}
		}
	}
	
	/// <summary>
	/// Is the weapon ready to create a new projectile?
	/// </summary>
	public bool CanAttack {
		get {
			return shootCooldown <= 0f;
		}
	}

}
