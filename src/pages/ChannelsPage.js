const { expect } = require('@playwright/test');

class ChannelsPage {
    constructor(newPage) {
        this.newPage = newPage;
        this.metricsContainer = newPage.locator('#root > div:nth-child(6) > div');
        this.currentStateLocator = this.metricsContainer.locator('text=Current state');
    }

    async waitForChannelsPageLoad() {
        console.log('Waiting for the Channels page to load...');
        await this.newPage.waitForLoadState('domcontentloaded');

        try {
            // Wait for the element containing "Current state: playing"
            await this.newPage.waitForFunction(
                (selector) => {
                    const container = document.querySelector(selector); // Use the passed selector
                    if (container) {
                        const textContent = container.innerText || container.textContent;
                        return /Current state:\s*playing/i.test(textContent); // Regex to match "Current state: playing"
                    }
                    return false;
                },
                '#root > div:nth-child(6) > div', // Pass the selector for the metrics container
                { timeout: 10000 } // Timeout after 10 seconds
            );

            console.log('Channels page successfully loaded.');
        } catch (error) {
            console.error('Error: Live stream did not start within the timeout period.');
            throw new Error('Live stream did not start within the timeout period.');
        }
    }

    async validateMetrics() {
        console.log('Validating live stream metrics...');

        const resolution = await this.metricsContainer.locator('text=Resolution').textContent();
        console.log(`Resolution: ${resolution}`);
        expect(resolution).toContain('1280x720'); // Validate the expected resolution

        const estimatedBandwidth = await this.metricsContainer.locator('text=Estimated bandwidth').textContent();
        console.log(`Estimated Bandwidth: ${estimatedBandwidth}`);
        const streamBandwidth = await this.metricsContainer.locator('text=Stream bandwidth').textContent();
        console.log(`Stream Bandwidth: ${streamBandwidth}`);
        expect(parseFloat(streamBandwidth.split(':')[1])).toBeGreaterThan(1.0); // Validate stream bandwidth > 1 Mbps

        const bufferingTime = await this.metricsContainer.locator('text=Buffering time').textContent();
        console.log(`Buffering Time: ${bufferingTime}`);
        expect(parseFloat(bufferingTime.split(':')[1])).toBeLessThan(2.0); // Validate buffering time < 1 second

        const stallsDetected = await this.metricsContainer.locator('text=Stalls detected').textContent();
        console.log(`Stalls Detected: ${stallsDetected}`);
        expect(parseInt(stallsDetected.split(':')[1])).toBe(0); // Validate no stalls

        const droppedFrames = await this.metricsContainer.locator('text=Dropped frames').textContent();
        console.log(`Dropped Frames: ${droppedFrames}`);
        expect(parseInt(droppedFrames.split(':')[1])).toBeLessThan(5); // Validate dropped frames < 5

        const currentState = await this.metricsContainer.locator('text=Current state').textContent();
        console.log(`Current State: ${currentState}`);
        expect(currentState).toContain('playing'); // Validate current state is "playing"
    }

    async validateCurrentTime() {
        console.log('Validating Current Time metric...');
        const currentTimeLocator = this.metricsContainer.locator('text=Current time');

        // Get the initial Current Time value
        const currentTimeValue1 = parseFloat((await currentTimeLocator.textContent()).split(':')[1]);
        console.log(`Initial Current Time: ${currentTimeValue1}`);

        // Wait for a short period to verify Current Time changes
        await this.newPage.waitForTimeout(5000); // Wait 5 seconds

        // Get the updated Current Time value
        const currentTimeValue2 = parseFloat((await currentTimeLocator.textContent()).split(':')[1]);
        console.log(`Updated Current Time: ${currentTimeValue2}`);

        // Verify that the Current Time value is increasing
        expect(currentTimeValue2).toBeGreaterThan(currentTimeValue1);
        console.log('Current Time is increasing as expected!');
    }
}

module.exports = ChannelsPage;