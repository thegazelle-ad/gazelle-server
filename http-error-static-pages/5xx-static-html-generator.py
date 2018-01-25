import os, errno
# Create build folder if it doesn't exist

def get_path(relative_path):
	cur_dir = os.path.dirname(__file__)
	return os.path.join(cur_dir, relative_path)

try:
    os.makedirs(get_path('build'))
except OSError as e:
    if e.errno != errno.EEXIST:
        raise

template = open(get_path('./5xx.template.html'), 'r')
templateString = template.read()
template.close()

# We only use 0-11 according to
# https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#5xx_Server_error
for i in range(12):
    numString = str(i) if i >= 10 else '0{}'.format(i)
    fileName = './build/5{}.html'.format(numString)
    outputFile = open(get_path(fileName), 'w')
    htmlString = templateString.replace('{ERROR_CODE_PLACEHOLDER}', '5{}'.format(numString))
    outputFile.write(htmlString)
    outputFile.close()
