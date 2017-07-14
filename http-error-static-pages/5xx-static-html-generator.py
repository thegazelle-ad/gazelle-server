import os, errno
# Create build folder if it doesn't exist
try:
    os.makedirs('build')
except OSError as e:
    if e.errno != errno.EEXIST:
        raise

template = open('./5xx.template.html', 'r')
templateString = template.read()
template.close()

# We only use 0-11 according to
# https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#5xx_Server_error
for i in range(12):
    numString = str(i) if i >= 10 else '0{}'.format(i)
    fileName = './build/5{}.html'.format(numString)
    outputFile = open(fileName, 'w')
    htmlString = templateString.replace('{ERROR_CODE_PLACEHOLDER}', '5{}'.format(numString))
    outputFile.write(htmlString)
    outputFile.close()
