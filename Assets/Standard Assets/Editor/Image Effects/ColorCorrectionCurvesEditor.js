
#pragma strict

@CustomEditor (ColorCorrectionCurves)

class ColorCorrectionCurvesEditor extends Editor {	
	var serObj : SerializedObject;	
	
	var mode : SerializedProperty;
	
	var redChannel : SerializedProperty;
	var greenChannel : SerializedProperty;
	var blueChannel : SerializedProperty;
	
	var useDepthCorrection : SerializedProperty;
	
	var depthRedChannel : SerializedProperty;
	var depthGreenChannel : SerializedProperty;	
	var depthBlueChannel : SerializedProperty;
	
	var zCurveChannel : SerializedProperty;
	
	var selectiveCc : SerializedProperty;
	var selectiveFromColor : SerializedProperty;
	var selectiveToColor : SerializedProperty;
	
	private var applyCurveChanges : boolean = false;
	
	function OnEnable () {
		serObj = new SerializedObject (target);
		
		mode = serObj.FindProperty ("mode");
		
		redChannel = serObj.FindProperty ("redChannel");
		greenChannel = serObj.FindProperty ("greenChannel");
		blueChannel = serObj.FindProperty ("blueChannel");
		
		useDepthCorrection = serObj.FindProperty ("useDepthCorrection");
		
		zCurveChannel = serObj.FindProperty ("zCurve");
		
		depthRedChannel = serObj.FindProperty ("depthRedChannel");
		depthGreenChannel = serObj.FindProperty ("depthGreenChannel");
		depthBlueChannel = serObj.FindProperty ("depthBlueChannel");	
				
		if (!redChannel.animationCurveValue.length) 
			redChannel.animationCurveValue = new AnimationCurve(Keyframe(0, 0.0, 1.0, 1.0), Keyframe(1, 1.0, 1.0, 1.0));
		if (!greenChannel.animationCurveValue.length) 
			greenChannel.animationCurveValue = new AnimationCurve(Keyframe(0, 0.0, 1.0, 1.0), Keyframe(1, 1.0, 1.0, 1.0));
		if (!blueChannel.animationCurveValue.length) 
			blueChannel.animationCurveValue = new AnimationCurve(Keyframe(0, 0.0, 1.0, 1.0), Keyframe(1, 1.0, 1.0, 1.0));
			
		if (!depthRedChannel.animationCurveValue.length) 
			depthRedChannel.animationCurveValue = new AnimationCurve(Keyframe(0, 0.0, 1.0, 1.0), Keyframe(1, 1.0, 1.0, 1.0));
		if (!depthGreenChannel.animationCurveValue.length) 
			depthGreenChannel.animationCurveValue = new AnimationCurve(Keyframe(0, 0.0, 1.0, 1.0), Keyframe(1, 1.0, 1.0, 1.0));
		if (!depthBlueChannel.animationCurveValue.length) 
			depthBlueChannel.animationCurveValue = new AnimationCurve(Keyframe(0, 0.0, 1.0, 1.0), Keyframe(1, 1.0, 1.0, 1.0));
			
		if (!zCurveChannel.animationCurveValue.length) 
			zCurveChannel.animationCurveValue = new AnimationCurve(Keyframe(0, 0.0, 1.0, 1.0), Keyframe(1, 1.0, 1.0, 1.0));			
					
		serObj.ApplyModifiedProperties (); 			
					
		selectiveCc = serObj.FindProperty ("selectiveCc");	 	
		selectiveFromColor = serObj.FindProperty ("selectiveFromColor");	 	
		selectiveToColor = serObj.FindProperty ("selectiveToColor");	 		
	}
	
	function CurveGui (name : String, animationCurve : SerializedProperty, color : Color) {
		// @NOTE: EditorGUILayout.CurveField is buggy and flickers, using PropertyField for now
        //animationCurve.animationCurveValue = EditorGUILayout.CurveField (GUIContent (name), animationCurve.animationCurveValue, color, Rect (0.0,0.0,1.0,1.0));
		EditorGUILayout.PropertyField (animationCurve, GUIContent (name));
		if (GUI.changed) 
			applyCurveChanges = true;
	}
	
	function BeginCurves () {
		applyCurveChanges = false;
	}
	
	function ApplyCurves () {
   		if (applyCurveChanges) {
   			serObj.ApplyModifiedProperties ();   
			(serObj.targetObject as ColorCorrectionCurves).gameObject.SendMessage ("UpdateTextures");
       }   	
	}
    		
    function OnInspectorGUI () {        
		serObj.Update ();  	
    	
		GUILayout.Label ("Curves to tweak colors. Advanced separates fore- and background.", EditorStyles.miniBoldLabel);    	
    	    	
    	EditorGUILayout.PropertyField (mode, GUIContent ("Mode"));
    	
		GUILayout.Label ("Curves", EditorStyles.boldLabel);		

		BeginCurves ();
    	    	    	
		CurveGui ("Red", redChannel, Color.red);
		CurveGui ("Blue", blueChannel, Color.blue);
		CurveGui ("Green", greenChannel, Color.green);
		
        EditorGUILayout.Separator ();
        
        if (mode.intValue > 0)
        	useDepthCorrection.boolValue = true;
        else 
        	useDepthCorrection.boolValue = false;
        
        if (useDepthCorrection.boolValue) {
			CurveGui ("Red (depth)", depthRedChannel, Color.red);
			CurveGui ("Blue (depth)", depthBlueChannel, Color.blue);
			CurveGui ("Green (depth)", depthGreenChannel, Color.green);
        	EditorGUILayout.Separator ();						  		        
			CurveGui ("Blend Curve", zCurveChannel, Color.grey);  	
        }
		        		
		if (mode.intValue > 0) {
			EditorGUILayout.Separator ();		
			GUILayout.Label("Selective Color Correction", EditorStyles.boldLabel);		
			EditorGUILayout.PropertyField (selectiveCc, GUIContent ("Enable"));	
			if (selectiveCc.boolValue) {	
				EditorGUILayout.PropertyField (selectiveFromColor, GUIContent ("Key"));
				EditorGUILayout.PropertyField (selectiveToColor, GUIContent ("Target"));
			}
		}
        
		ApplyCurves ();

		if (!applyCurveChanges)
			serObj.ApplyModifiedProperties ();         
    }
}
