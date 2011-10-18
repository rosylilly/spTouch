.PHONY: all main min test doc distclean update_submodules

SRC_DIR = src
TEST_DIR = test
TOOL_DIR = tools
DOC_DIR = doc

PREFIX = .
DIST_DIR = ${PREFIX}/dist

BASE_FILES = core gesture flickEvent tapEvent longTapEvent

SRC_FILES = intro ${BASE_FILES} outro
DOC_FILES = ${addprefix ${SRC_DIR}/,${addsuffix .js,${BASE_FILES}}} 
TEST_FILES = ${addprefix ${TEST_DIR}/,${addsuffix .js,${BASE_FILES}}} 

MODULES = ${addprefix ${SRC_DIR}/,${addsuffix .js,${SRC_FILES}}}

TOOL_JSDOC_BASE = ./tools/jsdoc
TOOL_JSDOC = java -jar ${TOOL_JSDOC_BASE}/jsrun.jar ${TOOL_JSDOC_BASE}/app/run.js

TOOL_UGLIFY_BASE = ./tools/uglify
JS_ENGINE = `which node nodejs`
TOOL_UGLIFY = ${JS_ENGINE} ${TOOL_UGLIFY_BASE} --unsafe

DIST_UNPACK = ${DIST_DIR}/spTouch.js
DIST_PACKED = ${DIST_DIR}/spTouch.min.js
DIST_TESTER = ${TEST_DIR}/spTouch.test.js

HASH = $(shell git log -1 --pretty=format:%H)
BRANCH = $(shell git branch 2> /dev/null | grep '^\*' | cut -b 3-)

all: update_submodules main min test doc

main: ${DIST_UNPACK}

${DIST_DIR}:
	@@mkdir -p ${DIST_DIR}

${DIST_UNPACK}: ${MODULES} | ${DIST_DIR}
	@@echo "Building:" ${DIST_UNPACK}

	@@cat ${MODULES} |\
		sed 's/@BRANCH/${BRANCH}/' |\
		sed 's/@HASH/${HASH}/' > ${DIST_UNPACK}

min: ${DIST_PACKED}

${DIST_PACKED}: ${DIST_UNPACK}
	@@if [ ! -z ${JS_ENGINE} ]; then \
		echo "Minitifying:" ${DIST_PACKED}; \
		${TOOL_UGLIFY} ${DIST_UNPACK} > ${DIST_PACKED}; \
	else \
		echo "Minitifying is require Node.js"; \
	fi;

test: ${DIST_TESTER}
	
${DIST_TESTER}: ${TEST_FILES} | ${DIST_UNPACK}
	@@echo "Building Tests:" ${DIST_TESTER}

	@@cat ${TEST_FILES} > ${DIST_TESTER}

doc: main
	@@echo "Building Documents:" ${DOC_DIR}
	@@mkdir -p ${DOC_DIR}
	@@${TOOL_JSDOC} -d=${DOC_DIR} -t=${TOOL_JSDOC_BASE}/templates/jsdoc -a -p ${DOC_FILES}

clean:
	@@echo "Cleaning..."
	@@rm -rf ${DIST_DIR}

distclean: clean
	@@echo "Removing Submodules"
	@@rm -rf tools/jsdoc

update_submodules:
	@@if [ -d .git ]; then \
		if git submodule status | grep -q -E '^-'; then \
			git submodule update --init --recursive; \
		else \
			git submodule update --init --recursive --merge; \
		fi; \
	fi;
	@@if [ -d ${TOOL_JSDOC_BASE} ]; then \
		cd ${TOOL_JSDOC_BASE}; \
		svn up; \
	else \
		svn co http://jsdoc-toolkit.googlecode.com/svn/trunk/jsdoc-toolkit ${TOOL_JSDOC_BASE}; \
	fi;

watch:
	@@watch --interval=0.5 make all
