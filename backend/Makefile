SCHEMA_PATH = prisma/schema.prisma
TIMESTAMP_FILE = timestamp.txt
MIGRATION_DIR = prisma/migrations/$(shell cat $(TIMESTAMP_FILE))_migration
MIGRATION_PATH = $(MIGRATION_DIR)/migration.sql

all: generate_migration

check_timestamp:
	if [ ! -f $(TIMESTAMP_FILE) ]; then \
		date +%Y%m%d%H%M%S > $(TIMESTAMP_FILE); \
	fi

generate_migration: check_timestamp
	mkdir -p $(MIGRATION_DIR)
	npx prisma migrate diff --from-empty --to-schema-datamodel $(SCHEMA_PATH) --script > $(MIGRATION_PATH)

resolve_migration: check_timestamp
	npx prisma migrate resolve --applied $(shell cat $(TIMESTAMP_FILE))_migration

deploy_migration: check_timestamp
	npx prisma migrate deploy --schema $(SCHEMA_PATH)

rollback_migration: check_timestamp
	npx prisma migrate rollback --schema $(SCHEMA_PATH)

clean:
	rm -rf prisma/migrations/$(shell cat $(TIMESTAMP_FILE))_migration/
	rm -f $(TIMESTAMP_FILE)

.PHONY: all generate_migration deploy_migration resolve_migration rollback_migration clean check_timestamp
