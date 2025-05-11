# TripPlanner - Schemat bazy danych PostgreSQL

## 1. Tabele

### users
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `email` VARCHAR(255) NOT NULL UNIQUE
- `created_at` TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
- `updated_at` TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
- `language_preference` VARCHAR(10) DEFAULT 'pl' NOT NULL
- `last_login_at` TIMESTAMP WITH TIME ZONE
- `is_active` BOOLEAN DEFAULT TRUE NOT NULL
- `avatar_url` TEXT
- `display_name` VARCHAR(100)
- `deleted_at` TIMESTAMP WITH TIME ZONE

### creators
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `user_id` UUID NOT NULL REFERENCES users(id)
- `display_name` VARCHAR(100) NOT NULL
- `biography` TEXT
- `profile_image_url` TEXT
- `created_at` TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
- `updated_at` TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
- `is_verified` BOOLEAN DEFAULT FALSE NOT NULL
- `contact_email` VARCHAR(255)
- `website` TEXT
- `deleted_at` TIMESTAMP WITH TIME ZONE
- UNIQUE(user_id) WHERE deleted_at IS NULL

### guides
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `creator_id` UUID NOT NULL REFERENCES creators(id)
- `title` VARCHAR(255) NOT NULL
- `description` TEXT NOT NULL
- `language` VARCHAR(10) DEFAULT 'pl' NOT NULL
- `price` DECIMAL(10, 2) DEFAULT 0.00 NOT NULL
- `is_published` BOOLEAN DEFAULT FALSE NOT NULL
- `created_at` TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
- `updated_at` TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
- `version` INTEGER DEFAULT 1 NOT NULL
- `cover_image_url` TEXT
- `location_name` VARCHAR(255) NOT NULL
- `recommended_days` INTEGER DEFAULT 1 NOT NULL
- `deleted_at` TIMESTAMP WITH TIME ZONE

### attractions
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `name` VARCHAR(255) NOT NULL
- `description` TEXT NOT NULL
- `address` TEXT NOT NULL
- `geolocation` GEOGRAPHY(POINT) NOT NULL
- `opening_hours` JSONB
- `contact_info` JSONB
- `images` JSONB DEFAULT '[]'::JSONB NOT NULL
- `created_at` TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
- `updated_at` TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
- `creator_id` UUID NOT NULL REFERENCES creators(id)
- `average_visit_time_minutes` INTEGER
- `ticket_price_info` TEXT
- `accessibility_info` TEXT
- `deleted_at` TIMESTAMP WITH TIME ZONE

### guide_attractions
- `guide_id` UUID NOT NULL REFERENCES guides(id)
- `attraction_id` UUID NOT NULL REFERENCES attractions(id)
- `order_index` INTEGER NOT NULL
- `custom_description` TEXT
- `is_highlight` BOOLEAN DEFAULT FALSE NOT NULL
- `created_at` TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
- PRIMARY KEY (guide_id, attraction_id)

### tags
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `name` VARCHAR(100) NOT NULL
- `category` VARCHAR(50) NOT NULL CHECK (category IN ('Cultural', 'Fun_Facts', 'Historical', 'Culinary'))
- `created_at` TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
- UNIQUE(name, category)

### attraction_tags
- `attraction_id` UUID NOT NULL REFERENCES attractions(id)
- `tag_id` UUID NOT NULL REFERENCES tags(id)
- `created_at` TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
- PRIMARY KEY (attraction_id, tag_id)

### plans
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `user_id` UUID NOT NULL REFERENCES users(id)
- `guide_id` UUID NOT NULL REFERENCES guides(id)
- `name` VARCHAR(255) NOT NULL
- `content` JSONB NOT NULL
- `generation_params` JSONB NOT NULL
- `created_at` TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
- `updated_at` TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
- `ai_generation_cost` DECIMAL(10, 6)
- `is_favorite` BOOLEAN DEFAULT FALSE NOT NULL
- `deleted_at` TIMESTAMP WITH TIME ZONE

### user_guide_access
- `user_id` UUID NOT NULL REFERENCES users(id)
- `guide_id` UUID NOT NULL REFERENCES guides(id)
- `access_type` VARCHAR(20) NOT NULL CHECK (access_type IN ('free', 'purchased', 'subscription'))
- `granted_at` TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
- `expires_at` TIMESTAMP WITH TIME ZONE
- `payment_id` TEXT
- PRIMARY KEY (user_id, guide_id)

### reviews
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `user_id` UUID NOT NULL REFERENCES users(id)
- `guide_id` UUID NOT NULL REFERENCES guides(id)
- `rating` INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5)
- `comment` TEXT
- `created_at` TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
- `updated_at` TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
- `is_visible` BOOLEAN DEFAULT TRUE NOT NULL
- UNIQUE(user_id, guide_id) WHERE is_visible = TRUE

### offline_cache_status
- `user_id` UUID NOT NULL REFERENCES users(id)
- `plan_id` UUID NOT NULL REFERENCES plans(id)
- `is_cached` BOOLEAN DEFAULT FALSE NOT NULL
- `last_synced_at` TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
- PRIMARY KEY (user_id, plan_id)

### user_guide_interactions
- `user_id` UUID NOT NULL REFERENCES users(id)
- `guide_id` UUID NOT NULL REFERENCES guides(id)
- `interaction_type` VARCHAR(50) NOT NULL CHECK (interaction_type IN ('view', 'detailed_view', 'bookmark', 'generate_plan', 'purchase'))
- `created_at` TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
- `last_interaction_at` TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
- `interaction_count` INTEGER DEFAULT 1 NOT NULL
- PRIMARY KEY (user_id, guide_id, interaction_type)

## 2. Relacje między tabelami

1. **users <-> creators** (Jeden do jednego)
   - Użytkownik może być twórcą (ale nie musi)
   - Relacja poprzez `creators.user_id`

2. **creators -> guides** (Jeden do wielu)
   - Twórca może stworzyć wiele przewodników
   - Relacja poprzez `guides.creator_id`

3. **creators -> attractions** (Jeden do wielu)
   - Twórca może dodać wiele atrakcji
   - Relacja poprzez `attractions.creator_id`

4. **guides <-> attractions** (Wiele do wielu)
   - Przewodnik zawiera wiele atrakcji
   - Atrakcja może być w wielu przewodnikach
   - Relacja poprzez tabelę łączącą `guide_attractions`

5. **attractions <-> tags** (Wiele do wielu)
   - Atrakcja może mieć wiele tagów
   - Tag może być przypisany do wielu atrakcji
   - Relacja poprzez tabelę łączącą `attraction_tags`

6. **users -> plans** (Jeden do wielu)
   - Użytkownik może mieć wiele planów
   - Relacja poprzez `plans.user_id`

7. **guides -> plans** (Jeden do wielu)
   - Plan jest oparty na jednym przewodniku
   - Relacja poprzez `plans.guide_id`

8. **users <-> guides** (Wiele do wielu)
   - Użytkownik może mieć dostęp do wielu przewodników
   - Przewodnik może być dostępny dla wielu użytkowników
   - Relacja poprzez tabelę łączącą `user_guide_access`

9. **users -> reviews** (Jeden do wielu)
   - Użytkownik może napisać wiele recenzji
   - Relacja poprzez `reviews.user_id`

10. **guides -> reviews** (Jeden do wielu)
    - Przewodnik może mieć wiele recenzji
    - Relacja poprzez `reviews.guide_id`

11. **users <-> plans** dla cache'owania (Wiele do wielu)
    - Użytkownik może mieć wiele planów dostępnych offline
    - Plan może być cache'owany dla wielu użytkowników
    - Relacja poprzez tabelę łączącą `offline_cache_status`

12. **users <-> guides** dla interakcji (Wiele do wielu)
    - Użytkownik może wchodzić w interakcje z wieloma przewodnikami
    - Przewodnik może mieć interakcje od wielu użytkowników
    - Relacja poprzez tabelę łączącą `user_guide_interactions`

## 3. Indeksy

### Indeksy dla poprawy wydajności wyszukiwania
- `CREATE INDEX idx_users_email ON users(email);`
- `CREATE INDEX idx_guides_creator_id ON guides(creator_id);`
- `CREATE INDEX idx_guides_is_published ON guides(is_published) WHERE is_published = TRUE;`
- `CREATE INDEX idx_guides_language ON guides(language);`
- `CREATE INDEX idx_guides_created_at ON guides(created_at);` # Dla sekcji "Nowości"
- `CREATE INDEX idx_attractions_creator_id ON attractions(creator_id);`
- `CREATE INDEX idx_plans_user_id ON plans(user_id);`
- `CREATE INDEX idx_plans_guide_id ON plans(guide_id);`
- `CREATE INDEX idx_plans_created_at ON plans(created_at);` # Dla sekcji "Ostatnio zapisane plany"
- `CREATE INDEX idx_plans_is_favorite ON plans(is_favorite) WHERE is_favorite = TRUE;`
- `CREATE INDEX idx_reviews_guide_id ON reviews(guide_id);`
- `CREATE INDEX idx_reviews_rating ON reviews(rating);` # Dla filtrowania i sortowania po ocenie

### Indeksy dla pól JSONB
- `CREATE INDEX idx_attractions_opening_hours ON attractions USING GIN (opening_hours);`
- `CREATE INDEX idx_attractions_contact_info ON attractions USING GIN (contact_info);`
- `CREATE INDEX idx_attractions_images ON attractions USING GIN (images);`
- `CREATE INDEX idx_plans_content ON plans USING GIN (content);`
- `CREATE INDEX idx_plans_generation_params ON plans USING GIN (generation_params);`

### Indeksy geograficzne
- `CREATE INDEX idx_attractions_geolocation ON attractions USING GIST (geolocation);`

### Indeksy dla soft delete
- `CREATE INDEX idx_users_deleted_at ON users(deleted_at) WHERE deleted_at IS NULL;`
- `CREATE INDEX idx_creators_deleted_at ON creators(deleted_at) WHERE deleted_at IS NULL;`
- `CREATE INDEX idx_guides_deleted_at ON guides(deleted_at) WHERE deleted_at IS NULL;`
- `CREATE INDEX idx_attractions_deleted_at ON attractions(deleted_at) WHERE deleted_at IS NULL;`
- `CREATE INDEX idx_plans_deleted_at ON plans(deleted_at) WHERE deleted_at IS NULL;`

### Indeksy dla interakcji
- `CREATE INDEX idx_user_guide_interactions_user_id ON user_guide_interactions(user_id);`
- `CREATE INDEX idx_user_guide_interactions_guide_id ON user_guide_interactions(guide_id);`
- `CREATE INDEX idx_user_guide_interactions_last_interaction ON user_guide_interactions(last_interaction_at);`
- `CREATE INDEX idx_user_guide_interactions_type ON user_guide_interactions(interaction_type);`

## 4. Row-Level Security (RLS)

### users
```sql
-- Polityka: Użytkownicy mogą czytać i aktualizować tylko swoje własne dane
CREATE POLICY user_read_own ON users
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY user_update_own ON users
    FOR UPDATE
    USING (auth.uid() = id);
```

### creators
```sql
-- Polityka: Twórcy mogą czytać i aktualizować tylko swoje własne dane
CREATE POLICY creator_read_own ON creators
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY creator_update_own ON creators
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Polityka: Każdy może czytać podstawowe dane twórców
CREATE POLICY creator_read_public ON creators
    FOR SELECT
    USING (true);
```

### guides
```sql
-- Polityka: Twórcy mogą czytać, aktualizować i usuwać tylko swoje własne przewodniki
CREATE POLICY guide_manage_own ON guides
    FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM creators WHERE id = creator_id));

-- Polityka: Każdy może czytać opublikowane przewodniki
CREATE POLICY guide_read_published ON guides
    FOR SELECT
    USING (is_published = TRUE AND deleted_at IS NULL);

-- Polityka: Użytkownicy mogą czytać przewodniki, do których mają dostęp
CREATE POLICY guide_read_access ON guides
    FOR SELECT
    USING (id IN (
        SELECT guide_id FROM user_guide_access
        WHERE user_id = auth.uid()
        AND (expires_at IS NULL OR expires_at > NOW())
    ));
```

### attractions
```sql
-- Polityka: Twórcy mogą zarządzać swoimi atrakcjami
CREATE POLICY attraction_manage_own ON attractions
    FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM creators WHERE id = creator_id));

-- Polityka: Każdy może czytać atrakcje, które są w opublikowanych przewodnikach
CREATE POLICY attraction_read_public ON attractions
    FOR SELECT
    USING (id IN (
        SELECT attraction_id FROM guide_attractions
        WHERE guide_id IN (SELECT id FROM guides WHERE is_published = TRUE AND deleted_at IS NULL)
    ));
```

### plans
```sql
-- Polityka: Użytkownicy mogą czytać, aktualizować i usuwać tylko swoje własne plany
CREATE POLICY plan_manage_own ON plans
    FOR ALL
    USING (auth.uid() = user_id);
```

### user_guide_access
```sql
-- Polityka: Użytkownicy mogą sprawdzać tylko swój własny dostęp
CREATE POLICY user_guide_access_read_own ON user_guide_access
    FOR SELECT
    USING (auth.uid() = user_id);

-- Polityka: System może zarządzać wszystkimi dostępami
CREATE POLICY user_guide_access_manage_system ON user_guide_access
    FOR ALL
    USING (auth.uid() IN (SELECT id FROM users WHERE is_admin = TRUE));
```

### reviews
```sql
-- Polityka: Użytkownicy mogą czytać, aktualizować i usuwać tylko swoje własne recenzje
CREATE POLICY review_manage_own ON reviews
    FOR ALL
    USING (auth.uid() = user_id);

-- Polityka: Każdy może czytać widoczne recenzje
CREATE POLICY review_read_visible ON reviews
    FOR SELECT
    USING (is_visible = TRUE);
```

### user_guide_interactions
```sql
-- Polityka: Użytkownicy mogą czytać tylko swoje własne interakcje
CREATE POLICY user_guide_interactions_read_own ON user_guide_interactions
    FOR SELECT
    USING (auth.uid() = user_id);

-- Polityka: System może odczytywać wszystkie interakcje 
CREATE POLICY user_guide_interactions_read_system ON user_guide_interactions
    FOR SELECT
    USING (auth.uid() IN (SELECT id FROM users WHERE is_admin = TRUE));
    
-- Polityka: Automatyczna aktualizacja przy interakcji
CREATE POLICY user_guide_interactions_upsert ON user_guide_interactions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
```

## 5. Uwagi i decyzje projektowe

1. **Soft Delete** - Zamiast trwałego usuwania danych, używamy kolumny `deleted_at`, co pozwala na odzyskanie usuniętych danych w razie potrzeby i zachowanie spójności historycznej.

2. **JSONB dla elastycznych struktur** - Używamy typu JSONB dla danych, które mogą mieć zmienną strukturę lub są złożone, takich jak:
   - `opening_hours` dla atrakcji (różne dni, różne godziny)
   - `images` dla kolekcji URL-i zdjęć
   - `content` dla wygenerowanych planów
   - `generation_params` dla parametrów generacji AI

3. **PostGIS dla danych geograficznych** - Używamy typu GEOGRAPHY dla współrzędnych geograficznych atrakcji, co ułatwi:
   - Wyszukiwanie atrakcji w pobliżu lokalizacji użytkownika
   - Obliczanie odległości między atrakcjami
   - Integrację z mapami OpenStreetMap/Leaflet

4. **Row-Level Security (RLS)** - Zaimplementowaliśmy polityki RLS dla bezpieczeństwa na poziomie wiersza, co gwarantuje, że:
   - Użytkownicy mogą czytać i modyfikować tylko swoje dane
   - Twórcy mogą zarządzać tylko swoimi przewodnikami i atrakcjami
   - Publiczny dostęp jest ograniczony do opublikowanych przewodników i widocznych recenzji

5. **Indeksy** - Utworzyliśmy indeksy dla poprawy wydajności:
   - GIN dla pól JSONB
   - GIST dla danych geograficznych
   - B-tree dla często używanych kolumn w zapytaniach filtrujących i łączących
   - Dodatkowe indeksy dla wspierania funkcjonalności strony głównej (ostatnie plany, nowe przewodniki)

6. **Normalizacja** - Schemat jest znormalizowany do poziomu 3NF, co gwarantuje minimalizację redundancji danych i zachowanie spójności.

7. **Skalowalność** - Struktura bazy danych jest zaprojektowana z myślą o przyszłym rozwoju:
   - Wersjonowanie przewodników (kolumna `version` w tabeli `guides`)
   - System płatności (tabela `user_guide_access` z informacjami o dostępie)
   - Tryb offline (tabela `offline_cache_status`)
   - Wielojęzyczność (kolumny `language` w tabelach `guides` i `language_preference` w `users`)

8. **Wsparcie dla strony głównej** - Schemat zawiera elementy wspierające personalizowane treści na stronie głównej:
   - Tabela `user_guide_interactions` śledzi interakcje użytkowników z przewodnikami 
   - Indeksy na datach utworzenia i modyfikacji wspierają efektywne zapytania o najnowsze plany i przewodniki
   - Pole `display_name` w tabeli `users` umożliwia personalizowane powitania

9. **Rozszerzalność** - Schemat pozwala na łatwe dodawanie nowych funkcjonalności:
   - System tagowania może być rozszerzony o nowe kategorie
   - Struktura JSONB pozwala na dodawanie nowych atrybutów bez zmian schematu
   - Relacje są zaprojektowane z myślą o przyszłych funkcjonalnościach 