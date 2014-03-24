using UnityEngine;
using System.Collections;

/// <summary>
/// Spawns enemies
/// </summary>
public class EnemySpawner : MonoBehaviour {

	/// <summary>
	/// Enemy prefab to spawn
	/// </summary>
	public Transform enemyPrefab;

	/// <summary>
	/// Cooldown between spawns
	/// </summary>
	public float spawnRate = 1f;
	public float minCooldown = 0.5f;

	//--------------------------------
	// Cooldown
	//--------------------------------
	private float spawnCooldown;
	
	void Start() {
		spawnCooldown = 0f;
	}
	
	// Update is called once per frame
	void Update() {
		if (spawnCooldown > 0) {
			spawnCooldown -= Time.deltaTime;
		}
		Spawn ();
	}

	//--------------------------------
	// Spawning from another script
	//--------------------------------
	
	/// <summary>
	/// Create a new projectile if possible
	/// </summary>
	private void Spawn() {
		if (CanSpawn) {
			spawnCooldown = Random.Range (0f, spawnRate);
			spawnCooldown = Mathf.Max(spawnCooldown, minCooldown);
			Debug.Log(spawnRate);
			
			// Create a new shot
			var enemyTransform = Instantiate(enemyPrefab) as Transform;
			
			// Assign position
			enemyTransform.position = transform.position;
		}
	}
	
	/// <summary>
	/// Is the weapon ready to create a new projectile?
	/// </summary>
	public bool CanSpawn {
		get {
			return spawnCooldown <= 0f;
		}
	}

}
