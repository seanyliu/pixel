using UnityEngine;
using System.Collections;

/// <summary>
/// Projectile behavior.
/// </summary>
public class ShotScript : MonoBehaviour {

	// Damage inflicted
	public int damage = 1;

	// Damages player or enemies?
	public bool isEnemyShot = false;

	// Use this for initialization
	void Start () {
		// 2 - Limited time to live to avoid any leak
		Destroy(gameObject, 20); // 20sec
	}
	
	// Update is called once per frame
	void Update () {
	
	}
}
