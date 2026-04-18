-- ============================================================
-- MAISON — Esquema de Base de Datos
-- Supabase / PostgreSQL
-- ============================================================
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ——— Extensiones ———
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Para búsqueda full-text

-- ============================================================
-- TABLA: categories
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  parent_id   UUID REFERENCES categories(id) ON DELETE SET NULL,
  position    INT  NOT NULL DEFAULT 0,
  is_active   BOOL NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_categories_slug     ON categories(slug);
CREATE INDEX idx_categories_parent   ON categories(parent_id);

-- ============================================================
-- TABLA: products
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id                UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug              TEXT    NOT NULL UNIQUE,
  name              TEXT    NOT NULL,
  description       TEXT    NOT NULL DEFAULT '',
  short_description TEXT,
  material          TEXT,
  care_instructions TEXT[], -- Array de instrucciones

  -- Precio base
  price             NUMERIC(12,2) NOT NULL CHECK (price >= 0),
  compare_at_price  NUMERIC(12,2) CHECK (compare_at_price >= 0),
  currency          TEXT    NOT NULL DEFAULT 'COP',

  -- Clasificación
  category_id       UUID    NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  tags              TEXT[]  NOT NULL DEFAULT '{}',
  badges            TEXT[]  NOT NULL DEFAULT '{}',
  -- badges válidos: 'nuevo' | 'best-seller' | 'oferta' | 'agotado' | 'exclusivo'

  -- SEO
  seo_title         TEXT,
  seo_description   TEXT,
  seo_keywords      TEXT[],

  -- Estado
  is_active         BOOL    NOT NULL DEFAULT true,
  published_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para búsqueda y filtrado
CREATE INDEX idx_products_slug        ON products(slug);
CREATE INDEX idx_products_category    ON products(category_id);
CREATE INDEX idx_products_active      ON products(is_active);
CREATE INDEX idx_products_price       ON products(price);
CREATE INDEX idx_products_published   ON products(published_at DESC);
CREATE INDEX idx_products_tags        ON products USING GIN(tags);
CREATE INDEX idx_products_badges      ON products USING GIN(badges);
-- Full-text search en nombre y descripción
CREATE INDEX idx_products_search      ON products USING GIN(
  to_tsvector('spanish', name || ' ' || COALESCE(description,''))
);

-- ============================================================
-- TABLA: product_images
-- ============================================================
CREATE TABLE IF NOT EXISTS product_images (
  id          UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id  UUID    NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url         TEXT    NOT NULL,
  alt         TEXT    NOT NULL DEFAULT '',
  position    INT     NOT NULL DEFAULT 0, -- 0 = imagen principal
  width       INT,
  height      INT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_images_product   ON product_images(product_id);
CREATE INDEX idx_images_position  ON product_images(product_id, position);

-- ============================================================
-- TABLA: product_variants (color × talla × stock)
-- ============================================================
CREATE TABLE IF NOT EXISTS product_variants (
  id          UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id  UUID    NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku         TEXT    NOT NULL UNIQUE,
  color_name  TEXT    NOT NULL,
  color_hex   TEXT    NOT NULL,
  size        TEXT    NOT NULL,
  stock       INT     NOT NULL DEFAULT 0 CHECK (stock >= 0),
  price       NUMERIC(12,2), -- NULL = usa precio del producto padre
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(product_id, color_hex, size) -- No duplicar variante
);

CREATE INDEX idx_variants_product ON product_variants(product_id);
CREATE INDEX idx_variants_sku     ON product_variants(sku);
CREATE INDEX idx_variants_stock   ON product_variants(stock);

-- ============================================================
-- TABLA: orders
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id                  UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number        TEXT    NOT NULL UNIQUE, -- "MAISON-2025-0001"

  -- Cliente
  customer_email      TEXT    NOT NULL,
  customer_name       TEXT    NOT NULL,
  customer_phone      TEXT,

  -- Dirección de envío
  shipping_address    JSONB   NOT NULL DEFAULT '{}',
  -- { street, city, department, postal_code, country }

  -- Totales
  subtotal            NUMERIC(12,2) NOT NULL,
  shipping_cost       NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount_amount     NUMERIC(12,2) NOT NULL DEFAULT 0,
  total               NUMERIC(12,2) NOT NULL,
  currency            TEXT    NOT NULL DEFAULT 'COP',

  -- Pago (Wompi)
  payment_status      TEXT    NOT NULL DEFAULT 'pending',
  -- pending | approved | declined | voided | error
  payment_method      TEXT,
  wompi_transaction_id TEXT   UNIQUE,
  wompi_reference     TEXT    UNIQUE,
  paid_at             TIMESTAMPTZ,

  -- Estado del pedido
  status              TEXT    NOT NULL DEFAULT 'pending',
  -- pending | confirmed | processing | shipped | delivered | cancelled | refunded
  notes               TEXT,

  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT chk_payment_status CHECK (
    payment_status IN ('pending','approved','declined','voided','error')
  ),
  CONSTRAINT chk_order_status CHECK (
    status IN ('pending','confirmed','processing','shipped','delivered','cancelled','refunded')
  )
);

CREATE INDEX idx_orders_number   ON orders(order_number);
CREATE INDEX idx_orders_email    ON orders(customer_email);
CREATE INDEX idx_orders_status   ON orders(status);
CREATE INDEX idx_orders_payment  ON orders(payment_status);
CREATE INDEX idx_orders_created  ON orders(created_at DESC);
CREATE INDEX idx_orders_wompi    ON orders(wompi_transaction_id);

-- ============================================================
-- TABLA: order_items
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
  id          UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id    UUID    NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id  UUID    NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  variant_id  UUID    REFERENCES product_variants(id) ON DELETE SET NULL,

  -- Snapshot del producto al momento de compra
  product_name  TEXT          NOT NULL,
  product_slug  TEXT          NOT NULL,
  image_url     TEXT          NOT NULL DEFAULT '',
  color_name    TEXT          NOT NULL,
  color_hex     TEXT          NOT NULL,
  size          TEXT          NOT NULL,
  sku           TEXT          NOT NULL,

  unit_price    NUMERIC(12,2) NOT NULL,
  quantity      INT           NOT NULL CHECK (quantity > 0),
  subtotal      NUMERIC(12,2) GENERATED ALWAYS AS (unit_price * quantity) STORED,

  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_order_items_order   ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- ============================================================
-- FUNCIÓN: updated_at automático
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar a todas las tablas con updated_at
CREATE TRIGGER trg_categories_updated
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_products_updated
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_variants_updated
  BEFORE UPDATE ON product_variants
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_orders_updated
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- FUNCIÓN: Generar número de pedido secuencial
-- ============================================================
CREATE SEQUENCE IF NOT EXISTS order_sequence START 1;

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'MAISON-' || TO_CHAR(NOW(), 'YYYY') || '-' ||
         LPAD(nextval('order_sequence')::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE categories       ENABLE ROW LEVEL SECURITY;
ALTER TABLE products         ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images   ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders           ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items      ENABLE ROW LEVEL SECURITY;

-- Políticas públicas (lectura anónima de catálogo activo)
CREATE POLICY "Public can read active categories"
  ON categories FOR SELECT
  USING (is_active = true);

CREATE POLICY "Public can read active products"
  ON products FOR SELECT
  USING (is_active = true);

CREATE POLICY "Public can read product images"
  ON product_images FOR SELECT USING (true);

CREATE POLICY "Public can read product variants"
  ON product_variants FOR SELECT USING (true);

-- Políticas admin (escritura solo con service_role)
-- El service_role bypasea RLS automáticamente en Supabase.
-- Para mayor control, usar: USING (auth.role() = 'service_role')

-- Clientes solo ven sus propios pedidos
CREATE POLICY "Customers see own orders"
  ON orders FOR SELECT
  USING (customer_email = auth.jwt() ->> 'email');

-- ============================================================
-- DATOS SEMILLA — Categorías iniciales
-- ============================================================
INSERT INTO categories (name, slug, position) VALUES
  ('Prêt-à-porter', 'pret-a-porter', 1),
  ('Accesorios',    'accesorios',    2),
  ('Calzado',       'calzado',       3),
  ('Joyería',       'joyeria',       4)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- VISTA: catalog_view (JOIN completo para el frontend)
-- ============================================================
CREATE OR REPLACE VIEW catalog_view AS
SELECT
  p.id,
  p.slug,
  p.name,
  p.description,
  p.short_description,
  p.material,
  p.care_instructions,
  p.price,
  p.compare_at_price,
  p.currency,
  p.tags,
  p.badges,
  p.seo_title,
  p.seo_description,
  p.seo_keywords,
  p.is_active,
  p.published_at,
  p.updated_at,
  -- Categoría
  jsonb_build_object(
    'id',   c.id,
    'name', c.name,
    'slug', c.slug
  ) AS category,
  -- Imágenes ordenadas por posición
  COALESCE(
    jsonb_agg(
      DISTINCT jsonb_build_object(
        'id',       pi.id,
        'url',      pi.url,
        'alt',      pi.alt,
        'position', pi.position,
        'width',    pi.width,
        'height',   pi.height
      ) ORDER BY pi.position
    ) FILTER (WHERE pi.id IS NOT NULL),
    '[]'::jsonb
  ) AS images,
  -- Variantes
  COALESCE(
    jsonb_agg(
      DISTINCT jsonb_build_object(
        'id',         pv.id,
        'sku',        pv.sku,
        'color',      jsonb_build_object('name', pv.color_name, 'hex', pv.color_hex),
        'size',       pv.size,
        'stock',      pv.stock,
        'price',      pv.price
      )
    ) FILTER (WHERE pv.id IS NOT NULL),
    '[]'::jsonb
  ) AS variants
FROM products p
JOIN categories c ON c.id = p.category_id
LEFT JOIN product_images pi ON pi.product_id = p.id
LEFT JOIN product_variants pv ON pv.product_id = p.id
GROUP BY p.id, c.id;
