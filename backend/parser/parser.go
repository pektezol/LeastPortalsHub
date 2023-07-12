package parser

import (
	"bufio"
	"fmt"
	"log"
	"os/exec"
	"strconv"
	"strings"
)

func ProcessDemo(demoPath string) (int, int, error) {
	cmd := exec.Command("bash", "-c", fmt.Sprintf(`echo "FEXBash" && ./backend/parser/parser %s`, demoPath))
	stdout, err := cmd.StdoutPipe()
	if err != nil {
		log.Println(err)
		return 0, 0, err
	}
	cmd.Start()
	scanner := bufio.NewScanner(stdout)
	var cmTicks, portalCount int
	for scanner.Scan() {
		line := scanner.Text()
		if strings.Contains(line, "CM ticks") {
			cmTicksStr := strings.TrimSpace(strings.Split(line, ":")[1])
			cmTicks, err = strconv.Atoi(cmTicksStr)
			if err != nil {
				return 0, 0, err
			}
		}
		if strings.Contains(line, "Portal count") {
			portalCountStr := strings.TrimSpace(strings.Split(line, ":")[1])
			portalCount, err = strconv.Atoi(portalCountStr)
			if err != nil {
				return 0, 0, err
			}
		}
	}
	cmd.Wait()
	// We don't check for error in wait, since FEXBash always gives segmentation fault
	// Wanted output is retrieved, so it's okay (i think)
	return portalCount, cmTicks, nil
}
