import {useCallback, useEffect, useRef, useState} from "react";
import * as d3 from "d3";

export default function D3Force({graph}) {
    const [linkDistance, setLinkDistance] = useState(100);
    const [linkForce, setLinkForce] = useState(0.1);
    const [centerRepelForce, setCenterRepelForce] = useState(-50);
    const ref = useRef();

    const getNodeFillColor = () => {
        return getComputedStyle(document.documentElement).getPropertyValue('--d3-force-node-fill-color').trim();
    };

    const getNodeLinkFillColor = () => {
        return getComputedStyle(document.documentElement).getPropertyValue('--d3-force-node-link-fill-color').trim();
    };

    const getNodeStrokeColor = () => {
        return getComputedStyle(document.documentElement).getPropertyValue('--d3-force-node-stroke-color').trim();
    };

    useEffect(() => {
        const svg = d3.select(ref.current);
        const width = window.innerWidth;
        const height = window.innerHeight * 0.5;

        svg.attr("width", "100vw").attr("height", "50vh");
        svg.selectAll("*").remove();

        const simulation = d3.forceSimulation(graph.nodes)
            .force("link", d3.forceLink(graph.links).id(d => d.id).distance(linkDistance).strength(linkForce))
            .force("charge", d3.forceManyBody().strength(centerRepelForce))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("radial", d3.forceRadial(height * 0.4, width / 2, height / 2))
            .on("tick", ticked);

        const link = svg.selectAll("line")
            .data(graph.links)
            .enter().append("line")
            .attr("stroke", "#aaa");

        const node = svg.selectAll("g")
            .data(graph.nodes)
            .enter().append("g");

        node.append("a")
            .attr("xlink:href", d => d.link)
            .attr("target", "_blank")
            .append("circle")
            .attr("r", d => d.radius)
            .attr("r", d => d.radius)
            .attr("fill", d => d.link ? "white" : "#3d3d3d")
            .attr("stroke", d => d.link ? getNodeStrokeColor() : "none")
            .attr("stroke-width", d => d.link ? 2 : 0)
            .call(drag(simulation));

        const label = svg.selectAll("text")
            .data(graph.nodes)
            .enter().append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "0.9em")
            .text(d => d.label)
            .style("font-family", "'Inter', sans-serif")
            .style("font-weight", "400")
            .style("font-size", "1.1rem")
            .style("fill", getComputedStyle(document.documentElement).getPropertyValue('--d3-force-label-fill-color').trim()) // Dynamically set color
            .style("pointer-events", "none")
            .style("user-select", "none");

        function ticked() {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node.attr("transform", d => `translate(${d.x},${d.y})`);

            label
                .attr("x", d => d.x)
                .attr("y", d => d.y + d.radius);
        }

        function handleResize() {
            const newWidth = window.innerWidth;
            const newHeight = window.innerHeight * 0.5;
            svg.attr("width", newWidth).attr("height", newHeight);
            simulation.force("center", d3.forceCenter(newWidth / 2, newHeight / 2));
            simulation.force("radial", d3.forceRadial(newHeight * 0.4, newWidth / 2, newHeight / 2)); // Update force
            simulation.alpha(1).restart();
        }

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [linkDistance, linkForce, centerRepelForce, graph]);

    // Use MutationObserver to detect Dark Mode change dynamically
    useEffect(() => {
        const observer = new MutationObserver(() => {
            // When the dark mode is toggled, update the node and label colors
            const nodes = d3.selectAll("circle");
            const labels = d3.selectAll("text");

            /*nodes.style("fill", getNodeFillColor());*/
            nodes.style("stroke", getNodeStrokeColor());
            labels.style("fill", getComputedStyle(document.documentElement).getPropertyValue('--d3-force-label-fill-color').trim());
        });

        // Observe changes on the <html> element (Dark mode toggle)
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"]
        });

        // Cleanup the observer when the component is unmounted
        return () => observer.disconnect();
    }, []);

    const drag = useCallback((simulation) => {
        let dragStarted = false;

        function dragstarted(event, d) {
            dragStarted = true;
            if (!event.active) simulation.alphaTarget(0.3).restart();
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
            if (!event.active) simulation.alphaTarget(0);
            if (!d.fixed) {
                d.fx = null;
                d.fy = null;
            }
            dragStarted = false;
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }, []);

    return (
        <div>
            <svg ref={ref} style={{width: "95vw", height: "50vh"}}></svg>
        </div>
    );
}