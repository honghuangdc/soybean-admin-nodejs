# Prisma 数据库模式文件路径
SCHEMA_PATH = prisma/schema.prisma
# 存储时间戳的临时文件
TIMESTAMP_FILE = timestamp.txt
# 迁移文件目录路径，使用时间戳命名
MIGRATION_DIR = prisma/migrations/$(shell cat $(TIMESTAMP_FILE))_migration
# 迁移 SQL 文件的具体路径
MIGRATION_PATH = $(MIGRATION_DIR)/migration.sql

init_migration:
	npx prisma migrate deploy --schema $(SCHEMA_PATH)
	npx prisma db seed

# 默认任务：生成迁移文件
all: generate_migration

# 检查并创建时间戳文件
# 如果时间戳文件不存在，则创建一个新的，格式为：年月日时分秒
check_timestamp:
	if [ ! -f $(TIMESTAMP_FILE) ]; then \
		date +%Y%m%d%H%M%S > $(TIMESTAMP_FILE); \
	fi

# 生成数据库迁移文件
# 1. 首先检查时间戳
# 2. 创建迁移目录
# 3. 使用 prisma migrate diff 生成迁移脚本，从空数据库到当前 schema
generate_migration: check_timestamp
	mkdir -p $(MIGRATION_DIR)
	npx prisma migrate diff --from-empty --to-schema-datamodel $(SCHEMA_PATH) --script > $(MIGRATION_PATH)

# 标记迁移已应用
# 用于手动标记某个迁移已经被应用到数据库
resolve_migration: check_timestamp
	npx prisma migrate resolve --applied $(shell cat $(TIMESTAMP_FILE))_migration

# 部署迁移
# 将所有未应用的迁移应用到数据库
deploy_migration:
	npx prisma migrate deploy --schema $(SCHEMA_PATH)

# 重置数据库
# 删除所有数据并重新应用所有迁移
reset_database:
	npx prisma migrate reset --schema $(SCHEMA_PATH) --force

# 删除临时时间戳文件
rm_temp_file:
	rm -f $(TIMESTAMP_FILE)

# 清理任务
# 1. 删除时间戳文件
# 2. 删除对应的迁移目录
clean: rm_temp_file
	rm -rf prisma/migrations/$(shell cat $(TIMESTAMP_FILE))_migration/

# 声明这些目标是伪目标（不产生实际文件的目标）
# 确保这些命令每次都会执行，而不会因为有同名文件而跳过
.PHONY: all generate_migration deploy_migration resolve_migration reset_database clean check_timestamp
