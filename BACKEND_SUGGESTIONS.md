# Spring Boot Backend Modeling for Roadmap 2026

## ⚠️ PROBLEMA CRÍTICO: Referencias Circulares en JSON

**URGENTE**: El backend actualmente está devolviendo JSON con referencias circulares infinitas:
```
category → item → category → item → category → ...
```

Esto causa el error: `SyntaxError: Unexpected token ']' ... is not valid JSON`

### Solución Requerida en el Backend

Debes agregar `@JsonIgnoreProperties` en las entidades para romper las referencias circulares:

```java
@Entity
public class RoadmapItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "category_id")
    @JsonIgnoreProperties("items")  // ← AGREGAR ESTO
    private Category category;
    
    // ... otros campos
}

@Entity
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("category")  // ← AGREGAR ESTO
    private List<RoadmapItem> items;
    
    // ... otros campos
}
```

**O mejor aún**, usa DTOs en lugar de devolver las entidades directamente:

```java
@RestController
@RequestMapping("/api/roadmap")
public class RoadmapController {
    
    @GetMapping
    public List<CategoryDTO> getRoadmap() {
        return categoryService.getAllCategories()
            .stream()
            .map(this::toCategoryDTO)
            .collect(Collectors.toList());
    }
    
    private CategoryDTO toCategoryDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setIcon(category.getIcon());
        dto.setColor(category.getColor());
        dto.setItems(category.getItems().stream()
            .map(this::toItemDTO)
            .collect(Collectors.toList()));
        return dto;
    }
    
    private ItemDTO toItemDTO(RoadmapItem item) {
        ItemDTO dto = new ItemDTO();
        dto.setId(item.getId());
        dto.setTitle(item.getTitle());
        // ... otros campos pero SIN incluir category
        return dto;
    }
}
```

---

To connect your Angular frontend with a Spring Boot backend, you should design your API to handle the nested structure of categories and items.

## 1. Entity Model

### Category Entity
```java
@Entity
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String icon;
    private String color;
    
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RoadmapItem> items;
}
```

### RoadmapItem Entity
```java
@Entity
public class RoadmapItem {
    @Id
    private String id; // Use UUID or String matching frontend
    private String title;
    private String description;
    private String category;
    private String status; // PENDING, IN_PROGRESS, COMPLETED
    private Integer progress;
    
    @Embedded
    private RoadmapNotes notes;
    
    @ElementCollection
    private List<String> links;
    
    @OneToMany(cascade = CascadeType.ALL)
    private List<RoadmapItem> subtasks;
}

@Embeddable
public class RoadmapNotes {
    private String learned;
    private String application;
    private String additions;
}
```

## 2. API Endpoints

- `GET /api/roadmap`: Returns the full list of categories with items.
- `PATCH /api/roadmap/items/{itemId}`: Update specific fields (status, progress, notes).
- `POST /api/roadmap/categories`: Add a new category.
- `POST /api/roadmap/categories/{catId}/items`: Add a new item to a category.

## 3. Frontend Integration

In your `roadmap.service.ts`, you would replace the Signal update logic with `HttpClient` calls:

```typescript
// Example updateItem using Backend
updateItem(categoryId: string, itemId: string, updates: Partial<RoadmapItem>) {
  this.http.patch(`/api/roadmap/items/${itemId}`, updates).subscribe(() => {
    // Then refresh local state
    this.refreshData();
  });
}
```

## 4. Database Recommendations
- **PostgreSQL**: Excellent for relational data with `List<String>` support using `@ElementCollection`.
- **MongoDB**: Would also be a great fit because the roadmap structure is naturally hierarchical (JSON-like).
