import fs from 'fs-extra';
import path from 'path';

export class TemplateService {
  static async generateEmptyActivity(projectPath: string, packageName: string) {
    const packageDir = packageName.replace(/\./g, '/');
    const dirs = [
      'app/src/main/java/' + packageDir,
      'app/src/main/res/layout',
      'app/src/main/res/values',
      'gradle/wrapper'
    ];

    for (const dir of dirs) {
      await fs.ensureDir(path.join(projectPath, dir));
    }

    // Create build.gradle.kts (Project level)
    await fs.writeFile(path.join(projectPath, 'build.gradle.kts'), `
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
}
    `);

    // Create MainActivity.kt
    await fs.writeFile(path.join(projectPath, 'app/src/main/java', packageDir, 'MainActivity.kt'), `package ${packageName}

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState) 
        setContentView(R.layout.activity_main)
    }
}
    `);

    // Create activity_main.xml
    await fs.writeFile(path.join(projectPath, 'app/src/main/res/layout/activity_main.xml'), `<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout 
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Hello Android IDE!"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

</androidx.constraintlayout.widget.ConstraintLayout>
    `);

    console.log('Project template generated at ' + projectPath);
  }
}