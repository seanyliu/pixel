using UnityEngine;
using System.Collections;

/// <summary>
/// Enemy generic script
/// </summary>

public class EnemyScript : MonoBehaviour {

	private bool hasSpawn;
	private MoveScript moveScript;
	private WeaponScript[] weapons;

	void Awake () {
		// Retrieve the weapon only once
		// Need to put an empty game object in the enemy so that's it's rotated
		// to shoot in the right direction.
		weapons = GetComponentsInChildren<WeaponScript>();

		// Retrieve scripts to disable when not spawn
		moveScript = GetComponent<MoveScript>();
	}

	// Disable everything (while off screen)
	void Start() {
		hasSpawn = false;

		/*
		 * REMOVE DISABLING OF STUFF OFF SCREEN
		// Disable everything
		// -- collider
		collider2D.enabled = false;
		// -- Moving
		moveScript.enabled = false;
		// -- Shooting
		foreach (WeaponScript weapon in weapons) {
			weapon.enabled = false;
		}
		*/
	}

	// Update is called once per frame
	void Update () {

		// 2 - Check if the enemy has spawned.
		if (hasSpawn == false) {
			if (renderer.IsVisibleFrom(Camera.main)) {
				Spawn();
			}
		} else {
			// Auto-fire
			foreach (WeaponScript weapon in weapons) {
				// Auto-fire
				if (weapon != null && weapon.CanAttack)
				{
					weapon.Attack(true);

					// Sound!
					SoundEffectsHelper.Instance.MakeEnemyShotSound();
				}
			}

			// Out of the camera ? Destroy the game object.
			if (renderer.IsVisibleFrom(Camera.main) == false) {
				Destroy(gameObject);
			}
		}
	}

	// Activate itself (called when gets on screen)
	private void Spawn() {
		hasSpawn = true;

		/*
		 * REMOVE ENABLING OFF STUFF OFF SCREEN
		// Enable everything
		// -- Collider
		collider2D.enabled = true;
		// -- Moving
		moveScript.enabled = true;
		// -- Shooting
		foreach (WeaponScript weapon in weapons) {
			weapon.enabled = true;
		}
		*/
	}
}
