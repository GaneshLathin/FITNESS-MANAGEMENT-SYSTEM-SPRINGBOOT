package Fitness_Management_System.Fitness.controller;

import Fitness_Management_System.Fitness.model.Exercise;
import Fitness_Management_System.Fitness.repository.ExerciseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/exercises")
@RequiredArgsConstructor
public class AdminExerciseController {

    private final ExerciseRepository exerciseRepository;
    private final Fitness_Management_System.Fitness.service.S3Service s3Service;

    // Upload media endpoint
    @PostMapping("/upload")
    public ResponseEntity<java.util.Map<String, String>> uploadMedia(@RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        String url = s3Service.uploadFile(file);
        java.util.Map<String, String> response = new java.util.HashMap<>();
        response.put("url", url);
        return ResponseEntity.ok(response);
    }

    // Create exercise
    @PostMapping
    public ResponseEntity<Exercise> create(@RequestBody Exercise req) {
        Exercise ex = new Exercise(); // ✅ create instance here
        ex.setName(req.getName());
        ex.setDescription(req.getDescription());
        ex.setTargetMuscles(req.getTargetMuscles());
        ex.setMediaUrl(req.getMediaUrl());
        return ResponseEntity.ok(exerciseRepository.save(ex));
    }

    // Update exercise
    @PutMapping("/{id}")
    public ResponseEntity<Exercise> update(@PathVariable Long id, @RequestBody Exercise req) {
        Exercise ex1 = exerciseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exercise not found"));
        ex1.setName(req.getName());
        ex1.setDescription(req.getDescription());
        ex1.setTargetMuscles(req.getTargetMuscles());
        ex1.setMediaUrl(req.getMediaUrl());
        return ResponseEntity.ok(exerciseRepository.save(ex1));
    }

    // Delete exercise
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!exerciseRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        exerciseRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // List all exercises
    @GetMapping
    public List<Exercise> listAll() {
        return exerciseRepository.findAll();
    }
}
