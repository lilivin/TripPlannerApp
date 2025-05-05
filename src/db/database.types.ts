export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  graphql_public: {
    Tables: Record<never, never>;
    Views: Record<never, never>;
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
  public: {
    Tables: {
      attraction_tags: {
        Row: {
          attraction_id: string;
          created_at: string;
          tag_id: string;
        };
        Insert: {
          attraction_id: string;
          created_at?: string;
          tag_id: string;
        };
        Update: {
          attraction_id?: string;
          created_at?: string;
          tag_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "attraction_tags_attraction_id_fkey";
            columns: ["attraction_id"];
            isOneToOne: false;
            referencedRelation: "attractions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "attraction_tags_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "tags";
            referencedColumns: ["id"];
          },
        ];
      };
      attractions: {
        Row: {
          accessibility_info: string | null;
          address: string;
          average_visit_time_minutes: number | null;
          contact_info: Json | null;
          created_at: string;
          creator_id: string;
          deleted_at: string | null;
          description: string;
          geolocation: unknown;
          id: string;
          images: Json;
          name: string;
          opening_hours: Json | null;
          ticket_price_info: string | null;
          updated_at: string;
        };
        Insert: {
          accessibility_info?: string | null;
          address: string;
          average_visit_time_minutes?: number | null;
          contact_info?: Json | null;
          created_at?: string;
          creator_id: string;
          deleted_at?: string | null;
          description: string;
          geolocation: unknown;
          id?: string;
          images?: Json;
          name: string;
          opening_hours?: Json | null;
          ticket_price_info?: string | null;
          updated_at?: string;
        };
        Update: {
          accessibility_info?: string | null;
          address?: string;
          average_visit_time_minutes?: number | null;
          contact_info?: Json | null;
          created_at?: string;
          creator_id?: string;
          deleted_at?: string | null;
          description?: string;
          geolocation?: unknown;
          id?: string;
          images?: Json;
          name?: string;
          opening_hours?: Json | null;
          ticket_price_info?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "attractions_creator_id_fkey";
            columns: ["creator_id"];
            isOneToOne: false;
            referencedRelation: "creators";
            referencedColumns: ["id"];
          },
        ];
      };
      creators: {
        Row: {
          biography: string | null;
          contact_email: string | null;
          created_at: string;
          deleted_at: string | null;
          display_name: string;
          id: string;
          is_verified: boolean;
          profile_image_url: string | null;
          updated_at: string;
          user_id: string;
          website: string | null;
        };
        Insert: {
          biography?: string | null;
          contact_email?: string | null;
          created_at?: string;
          deleted_at?: string | null;
          display_name: string;
          id?: string;
          is_verified?: boolean;
          profile_image_url?: string | null;
          updated_at?: string;
          user_id: string;
          website?: string | null;
        };
        Update: {
          biography?: string | null;
          contact_email?: string | null;
          created_at?: string;
          deleted_at?: string | null;
          display_name?: string;
          id?: string;
          is_verified?: boolean;
          profile_image_url?: string | null;
          updated_at?: string;
          user_id?: string;
          website?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "creators_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      guide_attractions: {
        Row: {
          attraction_id: string;
          created_at: string;
          custom_description: string | null;
          guide_id: string;
          is_highlight: boolean;
          order_index: number;
        };
        Insert: {
          attraction_id: string;
          created_at?: string;
          custom_description?: string | null;
          guide_id: string;
          is_highlight?: boolean;
          order_index: number;
        };
        Update: {
          attraction_id?: string;
          created_at?: string;
          custom_description?: string | null;
          guide_id?: string;
          is_highlight?: boolean;
          order_index?: number;
        };
        Relationships: [
          {
            foreignKeyName: "guide_attractions_attraction_id_fkey";
            columns: ["attraction_id"];
            isOneToOne: false;
            referencedRelation: "attractions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "guide_attractions_guide_id_fkey";
            columns: ["guide_id"];
            isOneToOne: false;
            referencedRelation: "guides";
            referencedColumns: ["id"];
          },
        ];
      };
      guides: {
        Row: {
          cover_image_url: string | null;
          created_at: string;
          creator_id: string;
          deleted_at: string | null;
          description: string;
          id: string;
          is_published: boolean;
          language: string;
          location_name: string;
          price: number;
          recommended_days: number;
          title: string;
          updated_at: string;
          version: number;
        };
        Insert: {
          cover_image_url?: string | null;
          created_at?: string;
          creator_id: string;
          deleted_at?: string | null;
          description: string;
          id?: string;
          is_published?: boolean;
          language?: string;
          location_name: string;
          price?: number;
          recommended_days?: number;
          title: string;
          updated_at?: string;
          version?: number;
        };
        Update: {
          cover_image_url?: string | null;
          created_at?: string;
          creator_id?: string;
          deleted_at?: string | null;
          description?: string;
          id?: string;
          is_published?: boolean;
          language?: string;
          location_name?: string;
          price?: number;
          recommended_days?: number;
          title?: string;
          updated_at?: string;
          version?: number;
        };
        Relationships: [
          {
            foreignKeyName: "guides_creator_id_fkey";
            columns: ["creator_id"];
            isOneToOne: false;
            referencedRelation: "creators";
            referencedColumns: ["id"];
          },
        ];
      };
      offline_cache_status: {
        Row: {
          is_cached: boolean;
          last_synced_at: string;
          plan_id: string;
          user_id: string;
        };
        Insert: {
          is_cached?: boolean;
          last_synced_at?: string;
          plan_id: string;
          user_id: string;
        };
        Update: {
          is_cached?: boolean;
          last_synced_at?: string;
          plan_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "offline_cache_status_plan_id_fkey";
            columns: ["plan_id"];
            isOneToOne: false;
            referencedRelation: "plans";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "offline_cache_status_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      plans: {
        Row: {
          ai_generation_cost: number | null;
          content: Json;
          created_at: string;
          deleted_at: string | null;
          generation_params: Json;
          guide_id: string;
          id: string;
          is_favorite: boolean;
          name: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          ai_generation_cost?: number | null;
          content: Json;
          created_at?: string;
          deleted_at?: string | null;
          generation_params: Json;
          guide_id: string;
          id?: string;
          is_favorite?: boolean;
          name: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          ai_generation_cost?: number | null;
          content?: Json;
          created_at?: string;
          deleted_at?: string | null;
          generation_params?: Json;
          guide_id?: string;
          id?: string;
          is_favorite?: boolean;
          name?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "plans_guide_id_fkey";
            columns: ["guide_id"];
            isOneToOne: false;
            referencedRelation: "guides";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "plans_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      reviews: {
        Row: {
          comment: string | null;
          created_at: string;
          guide_id: string;
          id: string;
          is_visible: boolean;
          rating: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          comment?: string | null;
          created_at?: string;
          guide_id: string;
          id?: string;
          is_visible?: boolean;
          rating: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          comment?: string | null;
          created_at?: string;
          guide_id?: string;
          id?: string;
          is_visible?: boolean;
          rating?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reviews_guide_id_fkey";
            columns: ["guide_id"];
            isOneToOne: false;
            referencedRelation: "guides";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reviews_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      spatial_ref_sys: {
        Row: {
          auth_name: string | null;
          auth_srid: number | null;
          proj4text: string | null;
          srid: number;
          srtext: string | null;
        };
        Insert: {
          auth_name?: string | null;
          auth_srid?: number | null;
          proj4text?: string | null;
          srid: number;
          srtext?: string | null;
        };
        Update: {
          auth_name?: string | null;
          auth_srid?: number | null;
          proj4text?: string | null;
          srid?: number;
          srtext?: string | null;
        };
        Relationships: [];
      };
      tags: {
        Row: {
          category: string;
          created_at: string;
          id: string;
          name: string;
        };
        Insert: {
          category: string;
          created_at?: string;
          id?: string;
          name: string;
        };
        Update: {
          category?: string;
          created_at?: string;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      user_guide_access: {
        Row: {
          access_type: string;
          expires_at: string | null;
          granted_at: string;
          guide_id: string;
          payment_id: string | null;
          user_id: string;
        };
        Insert: {
          access_type: string;
          expires_at?: string | null;
          granted_at?: string;
          guide_id: string;
          payment_id?: string | null;
          user_id: string;
        };
        Update: {
          access_type?: string;
          expires_at?: string | null;
          granted_at?: string;
          guide_id?: string;
          payment_id?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_guide_access_guide_id_fkey";
            columns: ["guide_id"];
            isOneToOne: false;
            referencedRelation: "guides";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_guide_access_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          deleted_at: string | null;
          email: string;
          id: string;
          is_active: boolean;
          language_preference: string;
          last_login_at: string | null;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          deleted_at?: string | null;
          email: string;
          id?: string;
          is_active?: boolean;
          language_preference?: string;
          last_login_at?: string | null;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          deleted_at?: string | null;
          email?: string;
          id?: string;
          is_active?: boolean;
          language_preference?: string;
          last_login_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      geography_columns: {
        Row: {
          coord_dimension: number | null;
          f_geography_column: unknown | null;
          f_table_catalog: unknown | null;
          f_table_name: unknown | null;
          f_table_schema: unknown | null;
          srid: number | null;
          type: string | null;
        };
        Relationships: [];
      };
      geometry_columns: {
        Row: {
          coord_dimension: number | null;
          f_geometry_column: unknown | null;
          f_table_catalog: string | null;
          f_table_name: unknown | null;
          f_table_schema: unknown | null;
          srid: number | null;
          type: string | null;
        };
        Insert: {
          coord_dimension?: number | null;
          f_geometry_column?: unknown | null;
          f_table_catalog?: string | null;
          f_table_name?: unknown | null;
          f_table_schema?: unknown | null;
          srid?: number | null;
          type?: string | null;
        };
        Update: {
          coord_dimension?: number | null;
          f_geometry_column?: unknown | null;
          f_table_catalog?: string | null;
          f_table_name?: unknown | null;
          f_table_schema?: unknown | null;
          srid?: number | null;
          type?: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      _postgis_deprecate: {
        Args: { oldname: string; newname: string; version: string };
        Returns: undefined;
      };
      _postgis_index_extent: {
        Args: { tbl: unknown; col: string };
        Returns: unknown;
      };
      _postgis_pgsql_version: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      _postgis_scripts_pgsql_version: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      _postgis_selectivity: {
        Args: { tbl: unknown; att_name: string; geom: unknown; mode?: string };
        Returns: number;
      };
      _st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      _st_bestsrid: {
        Args: { "": unknown };
        Returns: number;
      };
      _st_contains: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      _st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      _st_coveredby: {
        Args: { geom1: unknown; geom2: unknown } | { geog1: unknown; geog2: unknown };
        Returns: boolean;
      };
      _st_covers: {
        Args: { geom1: unknown; geom2: unknown } | { geog1: unknown; geog2: unknown };
        Returns: boolean;
      };
      _st_crosses: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      _st_dwithin: {
        Args: {
          geog1: unknown;
          geog2: unknown;
          tolerance: number;
          use_spheroid?: boolean;
        };
        Returns: boolean;
      };
      _st_equals: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      _st_intersects: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      _st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown };
        Returns: number;
      };
      _st_longestline: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      _st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: number;
      };
      _st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      _st_overlaps: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      _st_pointoutside: {
        Args: { "": unknown };
        Returns: unknown;
      };
      _st_sortablehash: {
        Args: { geom: unknown };
        Returns: number;
      };
      _st_touches: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      _st_voronoi: {
        Args: {
          g1: unknown;
          clip?: unknown;
          tolerance?: number;
          return_polygons?: boolean;
        };
        Returns: unknown;
      };
      _st_within: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      addauth: {
        Args: { "": string };
        Returns: boolean;
      };
      addgeometrycolumn: {
        Args:
          | {
              catalog_name: string;
              schema_name: string;
              table_name: string;
              column_name: string;
              new_srid_in: number;
              new_type: string;
              new_dim: number;
              use_typmod?: boolean;
            }
          | {
              schema_name: string;
              table_name: string;
              column_name: string;
              new_srid: number;
              new_type: string;
              new_dim: number;
              use_typmod?: boolean;
            }
          | {
              table_name: string;
              column_name: string;
              new_srid: number;
              new_type: string;
              new_dim: number;
              use_typmod?: boolean;
            };
        Returns: string;
      };
      box: {
        Args: { "": unknown } | { "": unknown };
        Returns: unknown;
      };
      box2d: {
        Args: { "": unknown } | { "": unknown };
        Returns: unknown;
      };
      box2d_in: {
        Args: { "": unknown };
        Returns: unknown;
      };
      box2d_out: {
        Args: { "": unknown };
        Returns: unknown;
      };
      box2df_in: {
        Args: { "": unknown };
        Returns: unknown;
      };
      box2df_out: {
        Args: { "": unknown };
        Returns: unknown;
      };
      box3d: {
        Args: { "": unknown } | { "": unknown };
        Returns: unknown;
      };
      box3d_in: {
        Args: { "": unknown };
        Returns: unknown;
      };
      box3d_out: {
        Args: { "": unknown };
        Returns: unknown;
      };
      box3dtobox: {
        Args: { "": unknown };
        Returns: unknown;
      };
      bytea: {
        Args: { "": unknown } | { "": unknown };
        Returns: string;
      };
      disablelongtransactions: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      dropgeometrycolumn: {
        Args:
          | {
              catalog_name: string;
              schema_name: string;
              table_name: string;
              column_name: string;
            }
          | { schema_name: string; table_name: string; column_name: string }
          | { table_name: string; column_name: string };
        Returns: string;
      };
      dropgeometrytable: {
        Args:
          | { table_name: string }
          | { catalog_name: string; schema_name: string; table_name: string }
          | { schema_name: string; table_name: string };
        Returns: string;
      };
      enablelongtransactions: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      equals: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geography: {
        Args: { "": string } | { "": unknown };
        Returns: unknown;
      };
      geography_analyze: {
        Args: { "": unknown };
        Returns: boolean;
      };
      geography_gist_compress: {
        Args: { "": unknown };
        Returns: unknown;
      };
      geography_gist_decompress: {
        Args: { "": unknown };
        Returns: unknown;
      };
      geography_out: {
        Args: { "": unknown };
        Returns: unknown;
      };
      geography_send: {
        Args: { "": unknown };
        Returns: string;
      };
      geography_spgist_compress_nd: {
        Args: { "": unknown };
        Returns: unknown;
      };
      geography_typmod_in: {
        Args: { "": unknown[] };
        Returns: number;
      };
      geography_typmod_out: {
        Args: { "": number };
        Returns: unknown;
      };
      geometry: {
        Args:
          | { "": unknown }
          | { "": unknown }
          | { "": unknown }
          | { "": unknown }
          | { "": unknown }
          | { "": string }
          | { "": string }
          | { "": unknown };
        Returns: unknown;
      };
      geometry_above: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_analyze: {
        Args: { "": unknown };
        Returns: boolean;
      };
      geometry_below: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_cmp: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: number;
      };
      geometry_contained_3d: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_contains: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_contains_3d: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_distance_box: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: number;
      };
      geometry_distance_centroid: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: number;
      };
      geometry_eq: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_ge: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_gist_compress_2d: {
        Args: { "": unknown };
        Returns: unknown;
      };
      geometry_gist_compress_nd: {
        Args: { "": unknown };
        Returns: unknown;
      };
      geometry_gist_decompress_2d: {
        Args: { "": unknown };
        Returns: unknown;
      };
      geometry_gist_decompress_nd: {
        Args: { "": unknown };
        Returns: unknown;
      };
      geometry_gist_sortsupport_2d: {
        Args: { "": unknown };
        Returns: undefined;
      };
      geometry_gt: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_hash: {
        Args: { "": unknown };
        Returns: number;
      };
      geometry_in: {
        Args: { "": unknown };
        Returns: unknown;
      };
      geometry_le: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_left: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_lt: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_out: {
        Args: { "": unknown };
        Returns: unknown;
      };
      geometry_overabove: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_overbelow: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_overlaps: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_overlaps_3d: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_overleft: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_overright: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_recv: {
        Args: { "": unknown };
        Returns: unknown;
      };
      geometry_right: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_same: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_same_3d: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_send: {
        Args: { "": unknown };
        Returns: string;
      };
      geometry_sortsupport: {
        Args: { "": unknown };
        Returns: undefined;
      };
      geometry_spgist_compress_2d: {
        Args: { "": unknown };
        Returns: unknown;
      };
      geometry_spgist_compress_3d: {
        Args: { "": unknown };
        Returns: unknown;
      };
      geometry_spgist_compress_nd: {
        Args: { "": unknown };
        Returns: unknown;
      };
      geometry_typmod_in: {
        Args: { "": unknown[] };
        Returns: number;
      };
      geometry_typmod_out: {
        Args: { "": number };
        Returns: unknown;
      };
      geometry_within: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometrytype: {
        Args: { "": unknown } | { "": unknown };
        Returns: string;
      };
      geomfromewkb: {
        Args: { "": string };
        Returns: unknown;
      };
      geomfromewkt: {
        Args: { "": string };
        Returns: unknown;
      };
      get_proj4_from_srid: {
        Args: { "": number };
        Returns: string;
      };
      gettransactionid: {
        Args: Record<PropertyKey, never>;
        Returns: unknown;
      };
      gidx_in: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gidx_out: {
        Args: { "": unknown };
        Returns: unknown;
      };
      json: {
        Args: { "": unknown };
        Returns: Json;
      };
      jsonb: {
        Args: { "": unknown };
        Returns: Json;
      };
      longtransactionsenabled: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      path: {
        Args: { "": unknown };
        Returns: unknown;
      };
      pgis_asflatgeobuf_finalfn: {
        Args: { "": unknown };
        Returns: string;
      };
      pgis_asgeobuf_finalfn: {
        Args: { "": unknown };
        Returns: string;
      };
      pgis_asmvt_finalfn: {
        Args: { "": unknown };
        Returns: string;
      };
      pgis_asmvt_serialfn: {
        Args: { "": unknown };
        Returns: string;
      };
      pgis_geometry_clusterintersecting_finalfn: {
        Args: { "": unknown };
        Returns: unknown[];
      };
      pgis_geometry_clusterwithin_finalfn: {
        Args: { "": unknown };
        Returns: unknown[];
      };
      pgis_geometry_collect_finalfn: {
        Args: { "": unknown };
        Returns: unknown;
      };
      pgis_geometry_makeline_finalfn: {
        Args: { "": unknown };
        Returns: unknown;
      };
      pgis_geometry_polygonize_finalfn: {
        Args: { "": unknown };
        Returns: unknown;
      };
      pgis_geometry_union_parallel_finalfn: {
        Args: { "": unknown };
        Returns: unknown;
      };
      pgis_geometry_union_parallel_serialfn: {
        Args: { "": unknown };
        Returns: string;
      };
      point: {
        Args: { "": unknown };
        Returns: unknown;
      };
      polygon: {
        Args: { "": unknown };
        Returns: unknown;
      };
      populate_geometry_columns: {
        Args: { use_typmod?: boolean } | { tbl_oid: unknown; use_typmod?: boolean };
        Returns: string;
      };
      postgis_addbbox: {
        Args: { "": unknown };
        Returns: unknown;
      };
      postgis_constraint_dims: {
        Args: { geomschema: string; geomtable: string; geomcolumn: string };
        Returns: number;
      };
      postgis_constraint_srid: {
        Args: { geomschema: string; geomtable: string; geomcolumn: string };
        Returns: number;
      };
      postgis_constraint_type: {
        Args: { geomschema: string; geomtable: string; geomcolumn: string };
        Returns: string;
      };
      postgis_dropbbox: {
        Args: { "": unknown };
        Returns: unknown;
      };
      postgis_extensions_upgrade: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      postgis_full_version: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      postgis_geos_noop: {
        Args: { "": unknown };
        Returns: unknown;
      };
      postgis_geos_version: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      postgis_getbbox: {
        Args: { "": unknown };
        Returns: unknown;
      };
      postgis_hasbbox: {
        Args: { "": unknown };
        Returns: boolean;
      };
      postgis_index_supportfn: {
        Args: { "": unknown };
        Returns: unknown;
      };
      postgis_lib_build_date: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      postgis_lib_revision: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      postgis_lib_version: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      postgis_libjson_version: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      postgis_liblwgeom_version: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      postgis_libprotobuf_version: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      postgis_libxml_version: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      postgis_noop: {
        Args: { "": unknown };
        Returns: unknown;
      };
      postgis_proj_version: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      postgis_scripts_build_date: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      postgis_scripts_installed: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      postgis_scripts_released: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      postgis_svn_version: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      postgis_type_name: {
        Args: {
          geomname: string;
          coord_dimension: number;
          use_new_name?: boolean;
        };
        Returns: string;
      };
      postgis_typmod_dims: {
        Args: { "": number };
        Returns: number;
      };
      postgis_typmod_srid: {
        Args: { "": number };
        Returns: number;
      };
      postgis_typmod_type: {
        Args: { "": number };
        Returns: string;
      };
      postgis_version: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      postgis_wagyu_version: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      spheroid_in: {
        Args: { "": unknown };
        Returns: unknown;
      };
      spheroid_out: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_3dclosestpoint: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      st_3ddistance: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: number;
      };
      st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      st_3dlength: {
        Args: { "": unknown };
        Returns: number;
      };
      st_3dlongestline: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      st_3dmakebox: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      st_3dmaxdistance: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: number;
      };
      st_3dperimeter: {
        Args: { "": unknown };
        Returns: number;
      };
      st_3dshortestline: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      st_addpoint: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      st_angle: {
        Args: { pt1: unknown; pt2: unknown; pt3: unknown; pt4?: unknown } | { line1: unknown; line2: unknown };
        Returns: number;
      };
      st_area: {
        Args: { "": unknown } | { geog: unknown; use_spheroid?: boolean } | { "": string };
        Returns: number;
      };
      st_area2d: {
        Args: { "": unknown };
        Returns: number;
      };
      st_asbinary: {
        Args: { "": unknown } | { "": unknown };
        Returns: string;
      };
      st_asencodedpolyline: {
        Args: { geom: unknown; nprecision?: number };
        Returns: string;
      };
      st_asewkb: {
        Args: { "": unknown };
        Returns: string;
      };
      st_asewkt: {
        Args: { "": unknown } | { "": unknown } | { "": string };
        Returns: string;
      };
      st_asgeojson: {
        Args:
          | { geom: unknown; maxdecimaldigits?: number; options?: number }
          | {
              r: Record<string, unknown>;
              geom_column?: string;
              maxdecimaldigits?: number;
              pretty_bool?: boolean;
            }
          | { geog: unknown; maxdecimaldigits?: number; options?: number }
          | { "": string };
        Returns: string;
      };
      st_asgml: {
        Args:
          | { geom: unknown; maxdecimaldigits?: number; options?: number }
          | {
              version: number;
              geom: unknown;
              maxdecimaldigits?: number;
              options?: number;
              nprefix?: string;
              id?: string;
            }
          | {
              version: number;
              geog: unknown;
              maxdecimaldigits?: number;
              options?: number;
              nprefix?: string;
              id?: string;
            }
          | {
              geog: unknown;
              maxdecimaldigits?: number;
              options?: number;
              nprefix?: string;
              id?: string;
            }
          | { "": string };
        Returns: string;
      };
      st_ashexewkb: {
        Args: { "": unknown };
        Returns: string;
      };
      st_askml: {
        Args:
          | { geom: unknown; maxdecimaldigits?: number; nprefix?: string }
          | { geog: unknown; maxdecimaldigits?: number; nprefix?: string }
          | { "": string };
        Returns: string;
      };
      st_aslatlontext: {
        Args: { geom: unknown; tmpl?: string };
        Returns: string;
      };
      st_asmarc21: {
        Args: { geom: unknown; format?: string };
        Returns: string;
      };
      st_asmvtgeom: {
        Args: {
          geom: unknown;
          bounds: unknown;
          extent?: number;
          buffer?: number;
          clip_geom?: boolean;
        };
        Returns: unknown;
      };
      st_assvg: {
        Args:
          | { geom: unknown; rel?: number; maxdecimaldigits?: number }
          | { geog: unknown; rel?: number; maxdecimaldigits?: number }
          | { "": string };
        Returns: string;
      };
      st_astext: {
        Args: { "": unknown } | { "": unknown } | { "": string };
        Returns: string;
      };
      st_astwkb: {
        Args:
          | {
              geom: unknown;
              prec?: number;
              prec_z?: number;
              prec_m?: number;
              with_sizes?: boolean;
              with_boxes?: boolean;
            }
          | {
              geom: unknown[];
              ids: number[];
              prec?: number;
              prec_z?: number;
              prec_m?: number;
              with_sizes?: boolean;
              with_boxes?: boolean;
            };
        Returns: string;
      };
      st_asx3d: {
        Args: { geom: unknown; maxdecimaldigits?: number; options?: number };
        Returns: string;
      };
      st_azimuth: {
        Args: { geom1: unknown; geom2: unknown } | { geog1: unknown; geog2: unknown };
        Returns: number;
      };
      st_boundary: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_boundingdiagonal: {
        Args: { geom: unknown; fits?: boolean };
        Returns: unknown;
      };
      st_buffer: {
        Args: { geom: unknown; radius: number; options?: string } | { geom: unknown; radius: number; quadsegs: number };
        Returns: unknown;
      };
      st_buildarea: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_centroid: {
        Args: { "": unknown } | { "": string };
        Returns: unknown;
      };
      st_cleangeometry: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_clipbybox2d: {
        Args: { geom: unknown; box: unknown };
        Returns: unknown;
      };
      st_closestpoint: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      st_clusterintersecting: {
        Args: { "": unknown[] };
        Returns: unknown[];
      };
      st_collect: {
        Args: { geom1: unknown; geom2: unknown } | { "": unknown[] };
        Returns: unknown;
      };
      st_collectionextract: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_collectionhomogenize: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_concavehull: {
        Args: {
          param_geom: unknown;
          param_pctconvex: number;
          param_allow_holes?: boolean;
        };
        Returns: unknown;
      };
      st_contains: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      st_convexhull: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_coorddim: {
        Args: { geometry: unknown };
        Returns: number;
      };
      st_coveredby: {
        Args: { geom1: unknown; geom2: unknown } | { geog1: unknown; geog2: unknown };
        Returns: boolean;
      };
      st_covers: {
        Args: { geom1: unknown; geom2: unknown } | { geog1: unknown; geog2: unknown };
        Returns: boolean;
      };
      st_crosses: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      st_curvetoline: {
        Args: { geom: unknown; tol?: number; toltype?: number; flags?: number };
        Returns: unknown;
      };
      st_delaunaytriangles: {
        Args: { g1: unknown; tolerance?: number; flags?: number };
        Returns: unknown;
      };
      st_difference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number };
        Returns: unknown;
      };
      st_dimension: {
        Args: { "": unknown };
        Returns: number;
      };
      st_disjoint: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      st_distance: {
        Args: { geom1: unknown; geom2: unknown } | { geog1: unknown; geog2: unknown; use_spheroid?: boolean };
        Returns: number;
      };
      st_distancesphere: {
        Args: { geom1: unknown; geom2: unknown } | { geom1: unknown; geom2: unknown; radius: number };
        Returns: number;
      };
      st_distancespheroid: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: number;
      };
      st_dump: {
        Args: { "": unknown };
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][];
      };
      st_dumppoints: {
        Args: { "": unknown };
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][];
      };
      st_dumprings: {
        Args: { "": unknown };
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][];
      };
      st_dumpsegments: {
        Args: { "": unknown };
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][];
      };
      st_dwithin: {
        Args: {
          geog1: unknown;
          geog2: unknown;
          tolerance: number;
          use_spheroid?: boolean;
        };
        Returns: boolean;
      };
      st_endpoint: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_envelope: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_equals: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      st_expand: {
        Args:
          | { box: unknown; dx: number; dy: number }
          | { box: unknown; dx: number; dy: number; dz?: number }
          | { geom: unknown; dx: number; dy: number; dz?: number; dm?: number };
        Returns: unknown;
      };
      st_exteriorring: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_flipcoordinates: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_force2d: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_force3d: {
        Args: { geom: unknown; zvalue?: number };
        Returns: unknown;
      };
      st_force3dm: {
        Args: { geom: unknown; mvalue?: number };
        Returns: unknown;
      };
      st_force3dz: {
        Args: { geom: unknown; zvalue?: number };
        Returns: unknown;
      };
      st_force4d: {
        Args: { geom: unknown; zvalue?: number; mvalue?: number };
        Returns: unknown;
      };
      st_forcecollection: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_forcecurve: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_forcepolygonccw: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_forcepolygoncw: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_forcerhr: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_forcesfs: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_generatepoints: {
        Args: { area: unknown; npoints: number } | { area: unknown; npoints: number; seed: number };
        Returns: unknown;
      };
      st_geogfromtext: {
        Args: { "": string };
        Returns: unknown;
      };
      st_geogfromwkb: {
        Args: { "": string };
        Returns: unknown;
      };
      st_geographyfromtext: {
        Args: { "": string };
        Returns: unknown;
      };
      st_geohash: {
        Args: { geom: unknown; maxchars?: number } | { geog: unknown; maxchars?: number };
        Returns: string;
      };
      st_geomcollfromtext: {
        Args: { "": string };
        Returns: unknown;
      };
      st_geomcollfromwkb: {
        Args: { "": string };
        Returns: unknown;
      };
      st_geometricmedian: {
        Args: {
          g: unknown;
          tolerance?: number;
          max_iter?: number;
          fail_if_not_converged?: boolean;
        };
        Returns: unknown;
      };
      st_geometryfromtext: {
        Args: { "": string };
        Returns: unknown;
      };
      st_geometrytype: {
        Args: { "": unknown };
        Returns: string;
      };
      st_geomfromewkb: {
        Args: { "": string };
        Returns: unknown;
      };
      st_geomfromewkt: {
        Args: { "": string };
        Returns: unknown;
      };
      st_geomfromgeojson: {
        Args: { "": string } | { "": Json } | { "": Json };
        Returns: unknown;
      };
      st_geomfromgml: {
        Args: { "": string };
        Returns: unknown;
      };
      st_geomfromkml: {
        Args: { "": string };
        Returns: unknown;
      };
      st_geomfrommarc21: {
        Args: { marc21xml: string };
        Returns: unknown;
      };
      st_geomfromtext: {
        Args: { "": string };
        Returns: unknown;
      };
      st_geomfromtwkb: {
        Args: { "": string };
        Returns: unknown;
      };
      st_geomfromwkb: {
        Args: { "": string };
        Returns: unknown;
      };
      st_gmltosql: {
        Args: { "": string };
        Returns: unknown;
      };
      st_hasarc: {
        Args: { geometry: unknown };
        Returns: boolean;
      };
      st_hausdorffdistance: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: number;
      };
      st_hexagon: {
        Args: { size: number; cell_i: number; cell_j: number; origin?: unknown };
        Returns: unknown;
      };
      st_hexagongrid: {
        Args: { size: number; bounds: unknown };
        Returns: Record<string, unknown>[];
      };
      st_interpolatepoint: {
        Args: { line: unknown; point: unknown };
        Returns: number;
      };
      st_intersection: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number };
        Returns: unknown;
      };
      st_intersects: {
        Args: { geom1: unknown; geom2: unknown } | { geog1: unknown; geog2: unknown };
        Returns: boolean;
      };
      st_isclosed: {
        Args: { "": unknown };
        Returns: boolean;
      };
      st_iscollection: {
        Args: { "": unknown };
        Returns: boolean;
      };
      st_isempty: {
        Args: { "": unknown };
        Returns: boolean;
      };
      st_ispolygonccw: {
        Args: { "": unknown };
        Returns: boolean;
      };
      st_ispolygoncw: {
        Args: { "": unknown };
        Returns: boolean;
      };
      st_isring: {
        Args: { "": unknown };
        Returns: boolean;
      };
      st_issimple: {
        Args: { "": unknown };
        Returns: boolean;
      };
      st_isvalid: {
        Args: { "": unknown };
        Returns: boolean;
      };
      st_isvaliddetail: {
        Args: { geom: unknown; flags?: number };
        Returns: Database["public"]["CompositeTypes"]["valid_detail"];
      };
      st_isvalidreason: {
        Args: { "": unknown };
        Returns: string;
      };
      st_isvalidtrajectory: {
        Args: { "": unknown };
        Returns: boolean;
      };
      st_length: {
        Args: { "": unknown } | { geog: unknown; use_spheroid?: boolean } | { "": string };
        Returns: number;
      };
      st_length2d: {
        Args: { "": unknown };
        Returns: number;
      };
      st_letters: {
        Args: { letters: string; font?: Json };
        Returns: unknown;
      };
      st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown };
        Returns: number;
      };
      st_linefromencodedpolyline: {
        Args: { txtin: string; nprecision?: number };
        Returns: unknown;
      };
      st_linefrommultipoint: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_linefromtext: {
        Args: { "": string };
        Returns: unknown;
      };
      st_linefromwkb: {
        Args: { "": string };
        Returns: unknown;
      };
      st_linelocatepoint: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: number;
      };
      st_linemerge: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_linestringfromwkb: {
        Args: { "": string };
        Returns: unknown;
      };
      st_linetocurve: {
        Args: { geometry: unknown };
        Returns: unknown;
      };
      st_locatealong: {
        Args: { geometry: unknown; measure: number; leftrightoffset?: number };
        Returns: unknown;
      };
      st_locatebetween: {
        Args: {
          geometry: unknown;
          frommeasure: number;
          tomeasure: number;
          leftrightoffset?: number;
        };
        Returns: unknown;
      };
      st_locatebetweenelevations: {
        Args: { geometry: unknown; fromelevation: number; toelevation: number };
        Returns: unknown;
      };
      st_longestline: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      st_m: {
        Args: { "": unknown };
        Returns: number;
      };
      st_makebox2d: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      st_makeline: {
        Args: { "": unknown[] } | { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      st_makepolygon: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_makevalid: {
        Args: { "": unknown } | { geom: unknown; params: string };
        Returns: unknown;
      };
      st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: number;
      };
      st_maximuminscribedcircle: {
        Args: { "": unknown };
        Returns: Record<string, unknown>;
      };
      st_memsize: {
        Args: { "": unknown };
        Returns: number;
      };
      st_minimumboundingcircle: {
        Args: { inputgeom: unknown; segs_per_quarter?: number };
        Returns: unknown;
      };
      st_minimumboundingradius: {
        Args: { "": unknown };
        Returns: Record<string, unknown>;
      };
      st_minimumclearance: {
        Args: { "": unknown };
        Returns: number;
      };
      st_minimumclearanceline: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_mlinefromtext: {
        Args: { "": string };
        Returns: unknown;
      };
      st_mlinefromwkb: {
        Args: { "": string };
        Returns: unknown;
      };
      st_mpointfromtext: {
        Args: { "": string };
        Returns: unknown;
      };
      st_mpointfromwkb: {
        Args: { "": string };
        Returns: unknown;
      };
      st_mpolyfromtext: {
        Args: { "": string };
        Returns: unknown;
      };
      st_mpolyfromwkb: {
        Args: { "": string };
        Returns: unknown;
      };
      st_multi: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_multilinefromwkb: {
        Args: { "": string };
        Returns: unknown;
      };
      st_multilinestringfromtext: {
        Args: { "": string };
        Returns: unknown;
      };
      st_multipointfromtext: {
        Args: { "": string };
        Returns: unknown;
      };
      st_multipointfromwkb: {
        Args: { "": string };
        Returns: unknown;
      };
      st_multipolyfromwkb: {
        Args: { "": string };
        Returns: unknown;
      };
      st_multipolygonfromtext: {
        Args: { "": string };
        Returns: unknown;
      };
      st_ndims: {
        Args: { "": unknown };
        Returns: number;
      };
      st_node: {
        Args: { g: unknown };
        Returns: unknown;
      };
      st_normalize: {
        Args: { geom: unknown };
        Returns: unknown;
      };
      st_npoints: {
        Args: { "": unknown };
        Returns: number;
      };
      st_nrings: {
        Args: { "": unknown };
        Returns: number;
      };
      st_numgeometries: {
        Args: { "": unknown };
        Returns: number;
      };
      st_numinteriorring: {
        Args: { "": unknown };
        Returns: number;
      };
      st_numinteriorrings: {
        Args: { "": unknown };
        Returns: number;
      };
      st_numpatches: {
        Args: { "": unknown };
        Returns: number;
      };
      st_numpoints: {
        Args: { "": unknown };
        Returns: number;
      };
      st_offsetcurve: {
        Args: { line: unknown; distance: number; params?: string };
        Returns: unknown;
      };
      st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      st_orientedenvelope: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_overlaps: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      st_perimeter: {
        Args: { "": unknown } | { geog: unknown; use_spheroid?: boolean };
        Returns: number;
      };
      st_perimeter2d: {
        Args: { "": unknown };
        Returns: number;
      };
      st_pointfromtext: {
        Args: { "": string };
        Returns: unknown;
      };
      st_pointfromwkb: {
        Args: { "": string };
        Returns: unknown;
      };
      st_pointm: {
        Args: {
          xcoordinate: number;
          ycoordinate: number;
          mcoordinate: number;
          srid?: number;
        };
        Returns: unknown;
      };
      st_pointonsurface: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_points: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_pointz: {
        Args: {
          xcoordinate: number;
          ycoordinate: number;
          zcoordinate: number;
          srid?: number;
        };
        Returns: unknown;
      };
      st_pointzm: {
        Args: {
          xcoordinate: number;
          ycoordinate: number;
          zcoordinate: number;
          mcoordinate: number;
          srid?: number;
        };
        Returns: unknown;
      };
      st_polyfromtext: {
        Args: { "": string };
        Returns: unknown;
      };
      st_polyfromwkb: {
        Args: { "": string };
        Returns: unknown;
      };
      st_polygonfromtext: {
        Args: { "": string };
        Returns: unknown;
      };
      st_polygonfromwkb: {
        Args: { "": string };
        Returns: unknown;
      };
      st_polygonize: {
        Args: { "": unknown[] };
        Returns: unknown;
      };
      st_project: {
        Args: { geog: unknown; distance: number; azimuth: number };
        Returns: unknown;
      };
      st_quantizecoordinates: {
        Args: {
          g: unknown;
          prec_x: number;
          prec_y?: number;
          prec_z?: number;
          prec_m?: number;
        };
        Returns: unknown;
      };
      st_reduceprecision: {
        Args: { geom: unknown; gridsize: number };
        Returns: unknown;
      };
      st_relate: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: string;
      };
      st_removerepeatedpoints: {
        Args: { geom: unknown; tolerance?: number };
        Returns: unknown;
      };
      st_reverse: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_segmentize: {
        Args: { geog: unknown; max_segment_length: number };
        Returns: unknown;
      };
      st_setsrid: {
        Args: { geom: unknown; srid: number } | { geog: unknown; srid: number };
        Returns: unknown;
      };
      st_sharedpaths: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      st_shiftlongitude: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_shortestline: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      st_simplifypolygonhull: {
        Args: { geom: unknown; vertex_fraction: number; is_outer?: boolean };
        Returns: unknown;
      };
      st_split: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      st_square: {
        Args: { size: number; cell_i: number; cell_j: number; origin?: unknown };
        Returns: unknown;
      };
      st_squaregrid: {
        Args: { size: number; bounds: unknown };
        Returns: Record<string, unknown>[];
      };
      st_srid: {
        Args: { geom: unknown } | { geog: unknown };
        Returns: number;
      };
      st_startpoint: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_subdivide: {
        Args: { geom: unknown; maxvertices?: number; gridsize?: number };
        Returns: unknown[];
      };
      st_summary: {
        Args: { "": unknown } | { "": unknown };
        Returns: string;
      };
      st_swapordinates: {
        Args: { geom: unknown; ords: unknown };
        Returns: unknown;
      };
      st_symdifference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number };
        Returns: unknown;
      };
      st_symmetricdifference: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      st_tileenvelope: {
        Args: {
          zoom: number;
          x: number;
          y: number;
          bounds?: unknown;
          margin?: number;
        };
        Returns: unknown;
      };
      st_touches: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      st_transform: {
        Args:
          | { geom: unknown; to_proj: string }
          | { geom: unknown; from_proj: string; to_proj: string }
          | { geom: unknown; from_proj: string; to_srid: number };
        Returns: unknown;
      };
      st_triangulatepolygon: {
        Args: { g1: unknown };
        Returns: unknown;
      };
      st_union: {
        Args:
          | { geom1: unknown; geom2: unknown }
          | { geom1: unknown; geom2: unknown; gridsize: number }
          | { "": unknown[] };
        Returns: unknown;
      };
      st_voronoilines: {
        Args: { g1: unknown; tolerance?: number; extend_to?: unknown };
        Returns: unknown;
      };
      st_voronoipolygons: {
        Args: { g1: unknown; tolerance?: number; extend_to?: unknown };
        Returns: unknown;
      };
      st_within: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      st_wkbtosql: {
        Args: { wkb: string };
        Returns: unknown;
      };
      st_wkttosql: {
        Args: { "": string };
        Returns: unknown;
      };
      st_wrapx: {
        Args: { geom: unknown; wrap: number; move: number };
        Returns: unknown;
      };
      st_x: {
        Args: { "": unknown };
        Returns: number;
      };
      st_xmax: {
        Args: { "": unknown };
        Returns: number;
      };
      st_xmin: {
        Args: { "": unknown };
        Returns: number;
      };
      st_y: {
        Args: { "": unknown };
        Returns: number;
      };
      st_ymax: {
        Args: { "": unknown };
        Returns: number;
      };
      st_ymin: {
        Args: { "": unknown };
        Returns: number;
      };
      st_z: {
        Args: { "": unknown };
        Returns: number;
      };
      st_zmax: {
        Args: { "": unknown };
        Returns: number;
      };
      st_zmflag: {
        Args: { "": unknown };
        Returns: number;
      };
      st_zmin: {
        Args: { "": unknown };
        Returns: number;
      };
      text: {
        Args: { "": unknown };
        Returns: string;
      };
      unlockrows: {
        Args: { "": string };
        Returns: number;
      };
      updategeometrysrid: {
        Args: {
          catalogn_name: string;
          schema_name: string;
          table_name: string;
          column_name: string;
          new_srid_in: number;
        };
        Returns: string;
      };
    };
    Enums: Record<never, never>;
    CompositeTypes: {
      geometry_dump: {
        path: number[] | null;
        geom: unknown | null;
      };
      valid_detail: {
        valid: boolean | null;
        reason: string | null;
        location: unknown | null;
      };
    };
  };
}

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"] | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;
