package parser

import (
	"bufio"
	"os/exec"
	"strconv"
	"strings"
)

func ProcessDemo(demoPath string) (int, int, error) {
	cmd := exec.Command("./backend/parser/parser-arm64", demoPath)
	stdout, err := cmd.StdoutPipe()
	if err != nil {
		return 0, 0, err
	}
	if err := cmd.Start(); err != nil {
		return 0, 0, err
	}
	scanner := bufio.NewScanner(stdout)
	var cmTicks, portalCount int
	for scanner.Scan() {
		line := scanner.Text()
		if strings.Contains(line, "CM Ticks") {
			cmTicksStr := strings.TrimSpace(strings.Split(line, ":")[1])
			cmTicks, err = strconv.Atoi(cmTicksStr)
			if err != nil {
				return 0, 0, err
			}
		}
		if strings.Contains(line, "Portal Count") {
			portalCountStr := strings.TrimSpace(strings.Split(line, ":")[1])
			portalCount, err = strconv.Atoi(portalCountStr)
			if err != nil {
				return 0, 0, err
			}
		}
	}
	if err := cmd.Wait(); err != nil {
		return 0, 0, err
	}
	return portalCount, cmTicks, nil
}
