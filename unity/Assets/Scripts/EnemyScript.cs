using UnityEngine;
using System.Collections;

/// <summary>
/// Enemy generic script
/// </summary>

public class EnemyScript : MonoBehaviour {

	private WeaponScript[] weapons;

	void Awake () {
		// Retrieve the weapon only once
		// Need to put an empty game object in the enemy so that's it's rotated
		// to shoot in the right direction.
		weapons = GetComponentsInChildren<WeaponScript>();
	}

	// Update is called once per frame
	void Update () {
		// Auto-fire
		foreach (WeaponScript weapon in weapons) {
			// Auto-fire
			if (weapon != null && weapon.CanAttack)
			{
				weapon.Attack(true);
			}
		}
	}
}
