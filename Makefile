# makefile configs
.PHONY: all prepare_zip_file
all: create_release

#vars
VERSION="0.0.0.2"

#recipes
create_release: prepare_zip_file
	@echo "Finished creating release V${VERSION}"

prepare_zip_file: build_ext
	@echo "Preparing zip file..."
	@zip -r Releases/grouptabs_v${VERSION}.zip build
	@echo "Zip file created and added to Releases/grouptabs_v${VERSION}.zip"

build_ext: 
	@echo "Building_extension..."
	@npm run build
	@echo "Finished building extension!"


