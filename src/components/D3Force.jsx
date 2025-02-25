import {useEffect, useRef, useState} from "react";
import * as d3 from "d3";

export default function D3Force({graph}) {
    // State to control the force parameters
    const [linkDistance, setLinkDistance] = useState(100); // Distance between linked nodes
    const [linkForce, setLinkForce] = useState(0.1); // Strength of the links between nodes
    const [centerRepelForce, setCenterRepelForce] = useState(-50); // Repulsive force applied to nodes
    const ref = useRef(); // Reference for the SVG element

    useEffect(() => {
        // Selecting the SVG element where the graph will be rendered
        const svg = d3.select(ref.current);
        const width = window.innerWidth;
        const height = window.innerHeight * 0.5;

        // Setting the width and height of the SVG element
        svg.attr("width", "100vw").attr("height", "50vh");

        // Initializing the force simulation with nodes and links
        const simulation = d3.forceSimulation(graph.nodes)
            .force("link", d3.forceLink(graph.links).id(d => d.id).distance(linkDistance).strength(linkForce))
            .force("charge", d3.forceManyBody().strength(centerRepelForce))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .on("tick", ticked);

        // Creating the links (edges) between nodes
        const link = svg.selectAll("line")
            .data(graph.links)
            .enter().append("line")
            .attr("stroke", "#aaa"); // Setting the color of the links

        // Creating the nodes (vertices)
        const node = svg.selectAll("g")
            .data(graph.nodes)
            .enter().append("g"); // Creating a group for each node

        // Adding circles for each node
        node.append("circle")
            .attr("r", d => d.radius)
            .attr("fill", d => d.tag ? "white" : "rgba(0, 0, 0, 0.8)")  // White if tag is true, otherwise dark color
            .attr("stroke", d => d.tag ? "rgba(0, 0, 0, 0.8)" : "none") // Stroke color for tagged nodes
            .attr("stroke-width", d => d.tag ? 2 : 0) // Stroke width for tagged nodes
            .call(drag(simulation)) // Adding drag behavior to nodes
            .on("click", handleClick); // Adding click event to nodes

        // Creating text labels for the nodes
        const label = svg.selectAll("text")
            .data(graph.nodes)
            .enter().append("text")
            .attr("x", d => d.x)
            .attr("y", d => d.y + d.radius)
            .attr("text-anchor", "middle")
            .attr("dy", ".35em")
            .text(d => d.label)
            .style("pointer-events", "none")
            .style("user-select", "none");

        // Function that updates the positions of the links, nodes, and labels
        function ticked() {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node
                .attr("transform", d => `translate(${d.x},${d.y})`); // Updating node position

            label
                .attr("x", d => d.x) // Updating label position
                .attr("y", d => d.y + d.radius);
        }

        // Click handler for nodes
        function handleClick(event, d) {
            if (d.link) {
                window.open(d.link, "_blank"); // Opens the link in a new tab if it exists
            }
        }

        // Function to handle dragging behavior for nodes
        function drag(simulation) {
            let dragStarted = false;

            function dragstarted(event, d) {
                dragStarted = true;
                if (!event.active) simulation.alphaTarget(0.3).restart(); // Restart simulation during drag
                d.fx = d.x;
                d.fy = d.y;
            }

            function dragged(event, d) {
                if (dragStarted) {
                    d.fx = event.x;
                    d.fy = event.y;
                }
            }

            function dragended(event, d) {
                if (!event.active) simulation.alphaTarget(0); // Stop simulation when drag ends
                d.fx = null;
                d.fy = null;
                dragStarted = false;
            }

            return d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended);
        }

        // Handle window resizing by adjusting the SVG and force simulation
        function handleResize() {
            const newWidth = window.innerWidth;
            const newHeight = window.innerHeight * 0.5;
            svg.attr("width", newWidth).attr("height", newHeight);
            simulation.force("center", d3.forceCenter(newWidth / 2, newHeight / 2));
            simulation.alpha(1).restart();
        }

        // Adding event listener for resizing the window
        window.addEventListener("resize", handleResize);

        // Cleanup function to remove the event listener on unmount
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [linkDistance, linkForce, centerRepelForce, graph]);

    return (
        <div>
            {/* Render the SVG container where the graph will be drawn */}
            <svg ref={ref} style={{width: "100vw", height: "50vh", background: "#f0f0f0"}}></svg>
        </div>
    );
}